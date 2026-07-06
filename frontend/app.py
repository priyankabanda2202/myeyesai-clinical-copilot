import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

load_dotenv(ROOT / ".env", override=True)

import importlib
import os
import time

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
from frontend.ui import inject_styles, panel, render_header, show_urgency
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


def urgency_counts(patients):
    red = len([p for p in patients if p.urgency == "RED"])
    yellow = len([p for p in patients if p.urgency == "YELLOW"])
    green = len([p for p in patients if p.urgency == "GREEN"])
    return red, yellow, green


st.set_page_config(
    page_title="MyEyesAI Clinical Copilot",
    page_icon="👁️",
    layout="wide",
    initial_sidebar_state="expanded",
)

inject_styles()

with st.sidebar:
    st.markdown("### Clinical Console")
    page = st.radio(
        "Modules",
        [
            "Dashboard",
            "Patient Intake",
            "Clinical Notes",
            "Reports",
            "Daily Brief",
            "Clinical Assistant",
        ],
        label_visibility="collapsed",
    )
    st.markdown("---")
    st.caption("Engine · Ollama")
    st.caption(f"Model · {os.getenv('OLLAMA_MODEL', 'llama3:latest')}")

render_header()

if page == "Dashboard":
    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())
    total = len(patients)
    red, yellow, green = urgency_counts(patients)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Active Caseload", total)
    col2.metric("Critical", red, delta="Immediate" if red else None)
    col3.metric("Urgent", yellow)
    col4.metric("Routine", green)

    st.markdown("#### Triage Distribution")
    chart_df = pd.DataFrame(
        {"Cases": [red, yellow, green]},
        index=["Critical", "Urgent", "Routine"],
    )
    st.bar_chart(chart_df, color="#2563eb", height=320)

elif page == "Patient Intake":
    col_left, col_right = st.columns([1, 1])

    with col_left:
        st.markdown("#### New Presentation")
        with st.form("patient_intake"):
            name = st.text_input("Patient identifier")
            age = st.number_input("Age", min_value=0, max_value=120, value=40)
            symptoms = st.text_area("Chief complaint", height=120)
            submitted = st.form_submit_button("Run Clinical Pipeline", use_container_width=True)

    with col_right:
        st.markdown("#### Analysis Output")
        if submitted:
            with st.status("Processing clinical workflow...", expanded=True) as status:
                st.write("Intake normalization")
                time.sleep(0.3)
                st.write("Ollama clinical reasoning")
                try:
                    result = run_clinical_workflow(name, age, symptoms)
                except Exception as exc:
                    status.update(label="Ollama unavailable", state="error")
                    st.error(
                        f"Ollama error: {exc}\n\n"
                        "Start Ollama and run: `ollama pull llama3.2`"
                    )
                    st.stop()
                st.write("Urgency stratification")
                time.sleep(0.2)
                st.write("Report generation")
                status.update(label="Analysis complete", state="complete")

            db = SessionLocal()
            create_patient(
                db, name, age, symptoms,
                result["analysis"], result["urgency"],
            )

            panel("Presentation Summary", result["summary"])
            panel("Clinical Assessment", result["analysis"], markdown=True)
            show_urgency(result["urgency"])
        else:
            st.markdown(
                '<div class="panel" style="color:#6b8cb8">Awaiting patient presentation...</div>',
                unsafe_allow_html=True,
            )

elif page == "Clinical Notes":
    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())

    if not patients:
        st.warning("No clinical records available.")
    else:
        for p in patients:
            with st.container():
                c1, c2 = st.columns([3, 1])
                with c1:
                    st.markdown(f"#### {p.name} · {p.age}y")
                with c2:
                    show_urgency(p.urgency)
                panel("Chief Complaint", p.symptoms)
                panel("Assessment", p.diagnosis, markdown=True)
                st.markdown("---")

elif page == "Reports":
    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())

    if not patients:
        st.warning("No reports available.")
    else:
        selected = st.selectbox("Select case", [p.name for p in patients])
        patient = next(p for p in patients if p.name == selected)

        col1, col2 = st.columns([2, 1])
        with col1:
            panel("Attending Report", patient.diagnosis, markdown=True)
        with col2:
            show_urgency(patient.urgency)
            panel("Patient Summary", f"Age {patient.age}\n\n{patient.symptoms}")

elif page == "Daily Brief":
    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())
    total = len(patients)
    red, yellow, green = urgency_counts(patients)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Caseload", total)
    col2.metric("Critical Today", red)
    col3.metric("Urgent Today", yellow)
    col4.metric("Routine Today", green)

    chart_df = pd.DataFrame(
        {"Cases": [red, yellow, green]},
        index=["Critical", "Urgent", "Routine"],
    )
    st.bar_chart(chart_df, color="#00d4aa", height=300)

    st.markdown(
        f"""
<div class="brief-card">
  <strong>Morning Brief — Dr Carl</strong><br><br>
  Critical cases requiring immediate action: <strong>{red}</strong><br>
  Urgent reviews scheduled: <strong>{yellow}</strong><br>
  Routine follow-ups: <strong>{green}</strong>
</div>
        """,
        unsafe_allow_html=True,
    )

elif page == "Clinical Assistant":
    db = SessionLocal()
    patients = valid_patients(db.query(Patient).all())

    if not patients:
        st.warning("No active cases for consultation.")
    else:
        col1, col2 = st.columns([1, 2])

        with col1:
            selected = st.selectbox("Active case", [p.name for p in patients])
            patient = next(p for p in patients if p.name == selected)
            panel("Case Context", f"**Age:** {patient.age}\n\n**Presentation:**\n{patient.symptoms}")
            show_urgency(patient.urgency)

        with col2:
            st.markdown("#### Real-time Clinical Assistant")

            if "chat" not in st.session_state:
                st.session_state.chat = []

            for msg in st.session_state.chat:
                with st.chat_message(msg["role"], avatar="🩺" if msg["role"] == "assistant" else "👤"):
                    st.markdown(msg["content"])

            if prompt := st.chat_input("Ask about this case..."):
                st.session_state.chat.append({"role": "user", "content": prompt})
                with st.chat_message("user", avatar="👤"):
                    st.markdown(prompt)

                with st.chat_message("assistant", avatar="🩺"):
                    with st.spinner("Ollama reasoning..."):
                        time.sleep(0.2)
                        try:
                            response = answer(prompt, patient)
                        except Exception as exc:
                            response = (
                                f"**Ollama unavailable:** {exc}\n\n"
                                "Ensure Ollama is running: `ollama serve` then `ollama pull llama3.2`"
                            )
                    st.markdown(response)
                st.session_state.chat.append({"role": "assistant", "content": response})

            if st.button("Clear session", type="secondary"):
                st.session_state.chat = []
                st.rerun()
