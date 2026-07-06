import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

load_dotenv(ROOT / ".env", override=True)

import importlib
import os

import pandas as pd
import streamlit as st

import agents.clinical_reasoning_agent as clinical_reasoning_agent
import agents.copilot_agent as copilot_agent
import database.crud as crud_module
import workflows.clinical_workflow as workflow_module

importlib.reload(clinical_reasoning_agent)
importlib.reload(copilot_agent)
importlib.reload(crud_module)
importlib.reload(workflow_module)

from agents.copilot_agent import answer
from database.crud import create_patient
from database.db import Base
from database.db import SessionLocal
from database.db import engine
from database.models import Patient
from workflows.clinical_workflow import run_clinical_workflow
import database.models

Base.metadata.create_all(bind=engine)


def seed_if_empty():
    db = SessionLocal()
    try:
        if db.query(Patient).count() == 0:
            from synthetic_data.generate_patients import generate_patients
            generate_patients(50)
    finally:
        db.close()


seed_if_empty()


def valid_patients(patients):
    return [p for p in patients if p.diagnosis and p.urgency]


def show_urgency(urgency):
    if not urgency:
        st.info("Urgency not recorded")
        return

    labels = {
        "RED": "High Urgency",
        "YELLOW": "Urgent",
        "GREEN": "Routine",
    }
    label = labels.get(urgency, urgency)
    if urgency == "RED":
        st.error(f"🔴 {label}")
    elif urgency == "YELLOW":
        st.warning(f"🟡 {label}")
    else:
        st.success(f"🟢 {label}")


def urgency_counts(patients):
    red = len([p for p in patients if p.urgency == "RED"])
    yellow = len([p for p in patients if p.urgency == "YELLOW"])
    green = len([p for p in patients if p.urgency == "GREEN"])
    return red, yellow, green


st.set_page_config(
    page_title="MyEyesAI Clinical Copilot",
    page_icon="👁️",
    layout="wide",
)

st.title("MyEyesAI Clinical Copilot")
st.caption("AI-powered clinical assistant for ophthalmology workflows")

with st.sidebar:
    st.header("Navigation")
    page = st.radio(
        "Go to",
        [
            "Dashboard",
            "Patient Intake",
            "Clinical Notes",
            "Reports",
            "Daily Brief",
            "AI Copilot",
        ],
    )
    llm_mode = os.getenv("LLM_MODE", "mock")
    st.caption(f"LLM mode: **{llm_mode}** (free testing)")

if page == "Dashboard":
    st.header("Dashboard")

    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())
    total = len(patients)
    red, yellow, green = urgency_counts(patients)

    col1, col2, col3 = st.columns(3)
    col1.metric("Active Patients", total)
    col2.metric("High Urgency", red)
    col3.metric("Reports Generated", total)

    st.subheader("Patient Urgency Distribution")
    st.caption("Distribution of patients by urgency level.")
    chart_df = pd.DataFrame(
        {"Patients": [red, yellow, green]},
        index=["RED", "YELLOW", "GREEN"],
    )
    st.bar_chart(chart_df)

elif page == "Patient Intake":
    st.header("Patient Intake")

    with st.form("patient_intake"):
        name = st.text_input("Patient Name")
        age = st.number_input("Age", min_value=0, max_value=120, value=40)
        symptoms = st.text_area("Chief Complaint")
        submitted = st.form_submit_button("Submit")

        if submitted:
            db = SessionLocal()

            result = run_clinical_workflow(name, age, symptoms)

            create_patient(
                db,
                name,
                age,
                symptoms,
                result["analysis"],
                result["urgency"],
            )

            st.write(result["summary"])
            st.write(result["analysis"])
            show_urgency(result["urgency"])

elif page == "Clinical Notes":
    st.header("Clinical Notes")

    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())

    if len(patients) == 0:
        st.warning("No patients with diagnosis and urgency found.")
    else:
        for p in patients:
            st.subheader(f"{p.name}")
            st.write(f"Age: {p.age}")
            st.write("Symptoms:")
            st.write(p.symptoms)
            st.write("Diagnosis:")
            st.write(p.diagnosis)
            st.write("Urgency:")
            show_urgency(p.urgency)
            st.divider()

elif page == "Reports":
    st.header("Reports")

    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())

    if len(patients) == 0:
        st.warning("No patients with diagnosis and urgency found.")
    else:
        selected = st.selectbox(
            "Select Patient",
            [p.name for p in patients],
        )

        patient = next(p for p in patients if p.name == selected)

        st.subheader("Doctor Report")
        st.write(patient.diagnosis)

        st.subheader("Patient Summary")
        st.write(
            f"""
Diagnosis:
{patient.diagnosis}

Urgency:
{patient.urgency}
"""
        )
        show_urgency(patient.urgency)

elif page == "Daily Brief":
    st.header("Chief of Staff Daily Brief")

    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())

    total = len(patients)
    red, yellow, green = urgency_counts(patients)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Patients", total)
    col2.metric("High Urgency Patients", red)
    col3.metric("Urgent Patients", yellow)
    col4.metric("Routine Patients", green)

    st.subheader("Patient Urgency Distribution")
    chart_df = pd.DataFrame(
        {"Patients": [red, yellow, green]},
        index=["RED", "YELLOW", "GREEN"],
    )
    st.bar_chart(chart_df)

    st.success(
        f"""
Good Morning Dr Carl.

Today:

🔴 {red} High Urgency Patients

🟡 {yellow} Urgent Patients

🟢 {green} Routine Patients
"""
    )

elif page == "AI Copilot":
    st.header("AI Copilot")

    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())

    if len(patients) == 0:
        st.warning("No patients with diagnosis and urgency found.")
    else:
        selected = st.selectbox(
            "Select Patient",
            [p.name for p in patients],
        )

        patient = next(p for p in patients if p.name == selected)

        st.write(
            f"""
Age: {patient.age}

Symptoms:
{patient.symptoms}
"""
        )
        show_urgency(patient.urgency)

        question = st.text_input("Ask the copilot")

        if question:
            response = answer(question, patient)
            st.write(response)
