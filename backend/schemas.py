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


class AutomationSummary(BaseModel):
    tasks_automated: list[str]
    manual_baseline_minutes: int
    automated_minutes: int
    time_saved_minutes: int
    time_saved_percent: int
    scheduling_recommendation: str
    revenue_signals: list[str]
    estimated_revenue_usd: int
    staff_hours_freed: float


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
    automation: AutomationSummary
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


class PracticeOperations(BaseModel):
    cases_automated: int
    minutes_saved_total: int
    hours_saved_total: float
    staff_capacity_gain_percent: int
    revenue_pipeline_usd: int
    revenue_at_risk_prevented_usd: int
    automation_rate_percent: int
    charts_auto_drafted: int
    physician_reviews_pending: int
    avg_time_per_case_minutes: int
    throughput_gain_percent: int
    monthly_projection_usd: int
