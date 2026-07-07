import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

load_dotenv(ROOT / ".env", override=True)

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from agents.clinical_utils import extract_confidence, extract_icd10, referral_for_urgency
from agents.copilot_agent import answer as copilot_answer
from agents.daily_brief_agent import build_daily_brief
from agents.text_format import clean_clinical_text
from backend.schemas import (
    AttestationRequest,
    AuditEntry,
    AutomationSummary,
    CopilotRequest,
    CopilotResponse,
    DailyBrief,
    IntakeRequest,
    IntakeResponse,
    PatientOut,
    PipelineStep,
    PracticeOperations,
    SchedulingEntry,
)
from agents.operations_agent import build_practice_operations, generate_automation_summary
from database.crud import (
    create_patient,
    list_audit_logs,
    log_event,
    patient_with_reports,
    save_attestation,
)
from database.db import Base, SessionLocal, engine
from database.migrate import migrate_db
from database.models import Patient
from workflows.clinical_workflow import run_clinical_workflow
import database.models  # noqa: F401

Base.metadata.create_all(bind=engine)
migrate_db()

app = FastAPI(
    title="VisionFlow Clinical Copilot API",
    version="2.1.0",
    description="VisionFlow Eye Institute — ophthalmology clinical decision support platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

URGENCY_ORDER = {"RED": 0, "YELLOW": 1, "GREEN": 2}
SCHEDULING_MAP = {
    "RED": "Auto-booked: same-day emergency slot (within 2 hours)",
    "YELLOW": "Auto-booked: priority slot within 24–48 hours",
    "GREEN": "Auto-booked: routine follow-up within 2 weeks",
}
static_dir = ROOT / "web" / "out"


def seed_if_empty(db: Session):
    if db.query(Patient).count() == 0:
        from synthetic_data.generate_patients import generate_patients
        generate_patients(50)


def valid_patients(db: Session):
    patients = (
        db.query(Patient)
        .filter(Patient.diagnosis.isnot(None), Patient.urgency.isnot(None))
        .all()
    )
    return sorted(patients, key=lambda p: URGENCY_ORDER.get(p.urgency or "GREEN", 3))


def build_pipeline_trace(result: dict) -> list[PipelineStep]:
    previews = {
        "intake": result.get("summary", "")[:200],
        "clinical_reasoning": result.get("analysis", "")[:200],
        "urgency": f"Triage level: {result.get('urgency', 'GREEN')}",
        "report": result.get("doctor_report", "")[:200],
        "patient_education": result.get("patient_education", "")[:200],
        "daily_brief": result.get("brief", "")[:200],
    }
    labels = {
        "intake": "Intake Agent",
        "clinical_reasoning": "Clinical Reasoning Agent",
        "urgency": "Urgency Stratification Agent",
        "report": "Report Generation Agent",
        "patient_education": "Patient Education Agent",
        "daily_brief": "Daily Brief Agent",
    }
    order = ["intake", "clinical_reasoning", "urgency", "report", "patient_education", "daily_brief"]
    return [
        PipelineStep(
            agent=key,
            label=labels[key],
            status="complete",
            output_preview=previews.get(key, ""),
        )
        for key in order
    ]


@app.on_event("startup")
def check_frontend():
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    if static_dir.exists():
        print(f"Frontend: serving Next.js from {static_dir}")
    else:
        print(f"WARNING: {static_dir} not found — run build.sh before deploy")


@app.get("/api/health")
def health():
    if os.getenv("GROQ_API_KEY"):
        provider = "groq"
        model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    elif os.getenv("OPENAI_API_KEY"):
        provider = "openai"
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    else:
        provider = "ollama"
        model = os.getenv("OLLAMA_MODEL", "llama3:latest")
    return {
        "status": "ok",
        "engine": provider,
        "model": model,
        "version": "2.1.0",
        "compliance": "hipaa-compliant",
    }


@app.get("/api/patients", response_model=list[PatientOut])
def list_patients():
    db = SessionLocal()
    try:
        return [patient_with_reports(db, p) for p in valid_patients(db)]
    finally:
        db.close()


@app.get("/api/patients/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int):
    db = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient_with_reports(db, patient)
    finally:
        db.close()


@app.get("/api/daily-brief", response_model=DailyBrief)
def daily_brief():
    db = SessionLocal()
    try:
        return build_daily_brief(db)
    finally:
        db.close()


@app.get("/api/audit", response_model=list[AuditEntry])
def audit_trail():
    db = SessionLocal()
    try:
        return list_audit_logs(db)
    finally:
        db.close()


@app.post("/api/patients/{patient_id}/attestation", response_model=PatientOut)
def attestation(patient_id: int, body: AttestationRequest):
    db = SessionLocal()
    try:
        if body.status not in {"accepted", "modified", "rejected", "pending"}:
            raise HTTPException(status_code=400, detail="Invalid attestation status")
        patient = save_attestation(db, patient_id, body.status, body.note)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient_with_reports(db, patient)
    finally:
        db.close()


@app.get("/api/operations", response_model=PracticeOperations)
def practice_operations():
    db = SessionLocal()
    try:
        return build_practice_operations(valid_patients(db))
    finally:
        db.close()


@app.get("/api/review-queue", response_model=list[PatientOut])
def review_queue():
    db = SessionLocal()
    try:
        pending = [
            p for p in valid_patients(db)
            if (p.review_status or "pending") == "pending"
        ]
        return [patient_with_reports(db, p) for p in pending]
    finally:
        db.close()


@app.get("/api/scheduling", response_model=list[SchedulingEntry])
def scheduling_desk():
    db = SessionLocal()
    try:
        patients = valid_patients(db)
        return [
            SchedulingEntry(
                id=p.id,
                name=p.name,
                urgency=p.urgency,
                scheduling_recommendation=SCHEDULING_MAP.get(
                    p.urgency or "GREEN", "Routine scheduling queue"
                ),
                referral_action=p.referral_action or "",
                review_status=p.review_status or "pending",
            )
            for p in patients
        ]
    finally:
        db.close()


@app.post("/api/intake", response_model=IntakeResponse)
def intake(body: IntakeRequest):
    db = SessionLocal()
    try:
        result = run_clinical_workflow(
            body.name,
            body.age,
            body.symptoms,
            body.laterality,
            body.visual_acuity,
            body.iop,
            body.duration,
            body.comorbidities,
        )
        analysis = clean_clinical_text(result["analysis"])
        doctor_report = clean_clinical_text(result.get("doctor_report", ""))
        patient_education = clean_clinical_text(result.get("patient_education", ""))
        icd10 = extract_icd10(analysis) or extract_icd10(doctor_report)
        confidence = extract_confidence(analysis)
        referral = referral_for_urgency(result["urgency"])
        automation = generate_automation_summary(body.name, result["urgency"], icd10, referral)

        patient = create_patient(
            db,
            body.name,
            body.age,
            body.symptoms,
            analysis,
            result["urgency"],
            doctor_report=doctor_report,
            patient_education=patient_education,
            laterality=body.laterality,
            visual_acuity=body.visual_acuity,
            iop=body.iop,
            duration=body.duration,
            comorbidities=body.comorbidities,
            icd10_codes=icd10,
            confidence_pct=confidence,
            referral_action=referral,
        )
        patient_data = patient_with_reports(db, patient)

        return IntakeResponse(
            summary=result["summary"],
            analysis=analysis,
            urgency=result["urgency"],
            doctor_report=doctor_report,
            patient_education=patient_education,
            icd10_codes=icd10,
            confidence_pct=confidence,
            referral_action=referral,
            pipeline_trace=build_pipeline_trace(result),
            automation=AutomationSummary(**automation),
            patient=PatientOut(**patient_data),
        )
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    finally:
        db.close()


@app.post("/api/copilot", response_model=CopilotResponse)
def copilot_chat(body: CopilotRequest):
    db = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.id == body.patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        try:
            response = copilot_answer(body.question, patient)
            log_event(
                db,
                "copilot_query",
                f"Q: {body.question[:120]}",
                body.patient_id,
            )
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        return CopilotResponse(answer=response)
    finally:
        db.close()


@app.websocket("/ws/copilot/{patient_id}")
async def copilot_ws(websocket: WebSocket, patient_id: int):
    await websocket.accept()
    db = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            await websocket.send_json({"error": "Patient not found"})
            await websocket.close()
            return

        while True:
            data = await websocket.receive_json()
            question = data.get("question", "")
            if not question.strip():
                continue
            try:
                response = copilot_answer(question, patient)
                log_event(db, "copilot_query", f"Q: {question[:120]}", patient_id)
                await websocket.send_json({"role": "assistant", "content": response})
            except Exception as exc:
                await websocket.send_json({"role": "assistant", "content": f"Error: {exc}"})
    except WebSocketDisconnect:
        pass
    finally:
        db.close()


if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="frontend")
