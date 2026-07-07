from sqlalchemy import inspect, text

from database.db import engine


PATIENT_COLUMNS = {
    "laterality": "VARCHAR DEFAULT 'OU'",
    "visual_acuity": "VARCHAR DEFAULT ''",
    "iop": "VARCHAR DEFAULT ''",
    "duration": "VARCHAR DEFAULT ''",
    "comorbidities": "VARCHAR DEFAULT ''",
    "icd10_codes": "VARCHAR DEFAULT ''",
    "confidence_pct": "INTEGER DEFAULT 0",
    "review_status": "VARCHAR DEFAULT 'pending'",
    "reviewer_note": "TEXT DEFAULT ''",
    "reviewed_at": "VARCHAR DEFAULT ''",
    "referral_action": "VARCHAR DEFAULT ''",
}


def migrate_db():
    inspector = inspect(engine)
    if "patients" not in inspector.get_table_names():
        return

    existing = {col["name"] for col in inspector.get_columns("patients")}
    with engine.begin() as conn:
        for name, col_type in PATIENT_COLUMNS.items():
            if name not in existing:
                conn.execute(text(f"ALTER TABLE patients ADD COLUMN {name} {col_type}"))
