from pydantic import BaseModel, field_validator

from agents.text_format import clean_clinical_text


class PriorityCase(BaseModel):
    id: int
    name: str
    age: int
    urgency: str
    symptoms: str


class PipelineStep(BaseModel):
    agent: str
    label: str
    status: str
    output_preview: str


class PatientOut(BaseModel):
    id: int
    name: str
    age: int
    symptoms: str
    diagnosis: str | None
    urgency: str | None
    laterality: str = "OU"
    visual_acuity: str = ""
    iop: str = ""
    duration: str = ""
    comorbidities: str = ""
    icd10_codes: str = ""
    confidence_pct: int = 0
    review_status: str = "pending"
    reviewer_note: str = ""
    reviewed_at: str = ""
    referral_action: str = ""
    doctor_report: str | None = None
    patient_education: str | None = None

    @field_validator("diagnosis", "doctor_report", "patient_education", "reviewer_note")
    @classmethod
    def strip_markdown(cls, value: str | None) -> str | None:
        return clean_clinical_text(value) if value else value


class IntakeRequest(BaseModel):
    name: str
    age: int
    symptoms: str
    laterality: str = "OU"
    visual_acuity: str = ""
    iop: str = ""
    duration: str = ""
    comorbidities: str = ""


class IntakeResponse(BaseModel):
    summary: str
    analysis: str
    urgency: str
    doctor_report: str
    patient_education: str
    icd10_codes: str
    confidence_pct: int
    referral_action: str
    pipeline_trace: list[PipelineStep]
    patient: PatientOut

    @field_validator("analysis", "doctor_report", "patient_education")
    @classmethod
    def strip_markdown(cls, value: str) -> str:
        return clean_clinical_text(value)


class DailyBrief(BaseModel):
    total: int
    red: int
    yellow: int
    green: int
    narrative: str
    priority_cases: list[PriorityCase]


class CopilotRequest(BaseModel):
    patient_id: int
    question: str


class CopilotResponse(BaseModel):
    answer: str

    @field_validator("answer")
    @classmethod
    def strip_markdown(cls, value: str) -> str:
        return clean_clinical_text(value)


class AttestationRequest(BaseModel):
    status: str
    note: str = ""


class AuditEntry(BaseModel):
    id: int
    patient_id: int | None
    event_type: str
    detail: str
    created_at: str
