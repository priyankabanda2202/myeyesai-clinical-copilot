from datetime import datetime, timezone

from sqlalchemy.orm import Session

from agents.text_format import clean_clinical_text
from database.models import AuditLog, Patient, Report


def log_event(db: Session, event_type: str, detail: str, patient_id: int | None = None):
    entry = AuditLog(
        patient_id=patient_id,
        event_type=event_type,
        detail=detail,
        created_at=datetime.now(timezone.utc),
    )
    db.add(entry)
    db.commit()


def create_patient(
    db: Session,
    name: str,
    age: int,
    symptoms: str,
    diagnosis: str,
    urgency: str,
    doctor_report: str | None = None,
    patient_education: str | None = None,
    laterality: str = "OU",
    visual_acuity: str = "",
    iop: str = "",
    duration: str = "",
    comorbidities: str = "",
    icd10_codes: str = "",
    confidence_pct: int = 0,
    referral_action: str = "",
):
    patient = Patient(
        name=name,
        age=age,
        symptoms=symptoms,
        diagnosis=diagnosis,
        urgency=urgency,
        laterality=laterality,
        visual_acuity=visual_acuity,
        iop=iop,
        duration=duration,
        comorbidities=comorbidities,
        icd10_codes=icd10_codes,
        confidence_pct=confidence_pct,
        referral_action=referral_action,
        review_status="pending",
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    if doctor_report or patient_education:
        report = Report(
            patient_id=patient.id,
            doctor_report=clean_clinical_text(doctor_report or ""),
            patient_report=clean_clinical_text(patient_education or ""),
        )
        db.add(report)
        db.commit()

    log_event(db, "intake_completed", f"Case created for {name} — triage {urgency}", patient.id)
    return patient


def get_report_for_patient(db: Session, patient_id: int) -> Report | None:
    return db.query(Report).filter(Report.patient_id == patient_id).first()


def patient_with_reports(db: Session, patient: Patient) -> dict:
    report = get_report_for_patient(db, patient.id)
    return {
        "id": patient.id,
        "name": patient.name,
        "age": patient.age,
        "symptoms": patient.symptoms,
        "diagnosis": patient.diagnosis,
        "urgency": patient.urgency,
        "laterality": getattr(patient, "laterality", None) or "OU",
        "visual_acuity": getattr(patient, "visual_acuity", None) or "",
        "iop": getattr(patient, "iop", None) or "",
        "duration": getattr(patient, "duration", None) or "",
        "comorbidities": getattr(patient, "comorbidities", None) or "",
        "icd10_codes": getattr(patient, "icd10_codes", None) or "",
        "confidence_pct": getattr(patient, "confidence_pct", None) or 0,
        "review_status": getattr(patient, "review_status", None) or "pending",
        "reviewer_note": getattr(patient, "reviewer_note", None) or "",
        "reviewed_at": getattr(patient, "reviewed_at", None) or "",
        "referral_action": getattr(patient, "referral_action", None) or "",
        "doctor_report": report.doctor_report if report else None,
        "patient_education": report.patient_report if report else None,
    }


def save_attestation(db: Session, patient_id: int, status: str, note: str = ""):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        return None
    patient.review_status = status
    patient.reviewer_note = note
    patient.reviewed_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    db.commit()
    db.refresh(patient)
    log_event(db, "physician_attestation", f"Status: {status}. Note: {note or 'None'}", patient_id)
    return patient


def list_audit_logs(db: Session, limit: int = 50):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": log.id,
            "patient_id": log.patient_id,
            "event_type": log.event_type,
            "detail": log.detail,
            "created_at": log.created_at.isoformat() if log.created_at else "",
        }
        for log in logs
    ]
