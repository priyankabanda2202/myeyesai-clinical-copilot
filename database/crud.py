from sqlalchemy.orm import Session
from database.models import Patient


def create_patient(
    db: Session,
    name: str,
    age: int,
    symptoms: str,
    diagnosis: str,
    urgency: str,
):
    patient = Patient(
        name=name,
        age=age,
        symptoms=symptoms,
        diagnosis=diagnosis,
        urgency=urgency,
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient
