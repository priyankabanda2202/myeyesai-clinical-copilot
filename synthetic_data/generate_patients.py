"""Generate synthetic ophthalmology patients for demo dashboards."""

import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from faker import Faker

from database.db import Base, SessionLocal, engine
from database.models import Patient
import database.models  # noqa: F401

fake = Faker()

CONDITIONS = [
    {
        "label": "Cataract",
        "symptoms": "Gradual blurry vision and glare from headlights",
        "diagnosis": "**1 Diagnosis**\nAge-related cataract - suspected\n\n**4 Confidence Score**\n78%",
        "urgency": "GREEN",
    },
    {
        "label": "Glaucoma",
        "symptoms": "Eye pain with halos around lights and nausea",
        "diagnosis": "**1 Diagnosis**\nAcute angle-closure glaucoma - suspected\n\n**4 Confidence Score**\n74%",
        "urgency": "RED",
    },
    {
        "label": "Diabetic Retinopathy",
        "symptoms": "Blurred vision and floaters in both eyes",
        "diagnosis": "**1 Diagnosis**\nDiabetic retinopathy - suspected\n\n**4 Confidence Score**\n70%",
        "urgency": "YELLOW",
    },
    {
        "label": "Macular Degeneration",
        "symptoms": "Distorted central vision and difficulty reading",
        "diagnosis": "**1 Diagnosis**\nAge-related macular degeneration - suspected\n\n**4 Confidence Score**\n68%",
        "urgency": "YELLOW",
    },
    {
        "label": "Retinal Artery Occlusion",
        "symptoms": "Sudden vision loss in one eye",
        "diagnosis": "**1 Diagnosis**\nCentral Retinal Artery Occlusion (CRAO) - suspected\n\n**4 Confidence Score**\n72%",
        "urgency": "RED",
    },
    {
        "label": "Dry Eye",
        "symptoms": "Burning gritty sensation and intermittent blur",
        "diagnosis": "**1 Diagnosis**\nDry eye syndrome - suspected\n\n**4 Confidence Score**\n65%",
        "urgency": "GREEN",
    },
]


def generate_patients(count: int = 100):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        for _ in range(count):
            condition = random.choice(CONDITIONS)
            patient = Patient(
                name=fake.name(),
                age=random.randint(45, 85),
                symptoms=condition["symptoms"],
                diagnosis=condition["diagnosis"],
                urgency=condition["urgency"],
            )
            db.add(patient)

        db.commit()
        print(f"Generated {count} synthetic patients.")
    finally:
        db.close()


if __name__ == "__main__":
    generate_patients(100)
