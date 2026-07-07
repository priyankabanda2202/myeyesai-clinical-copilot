from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text

from database.db import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    symptoms = Column(Text)
    diagnosis = Column(Text)
    urgency = Column(String)
    laterality = Column(String, default="OU")
    visual_acuity = Column(String, default="")
    iop = Column(String, default="")
    duration = Column(String, default="")
    comorbidities = Column(String, default="")
    icd10_codes = Column(String, default="")
    confidence_pct = Column(Integer, default=0)
    review_status = Column(String, default="pending")
    reviewer_note = Column(Text, default="")
    reviewed_at = Column(String, default="")
    referral_action = Column(String, default="")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer)
    doctor_report = Column(Text)
    patient_report = Column(Text)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=True)
    event_type = Column(String)
    detail = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
