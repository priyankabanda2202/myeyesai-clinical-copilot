import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"


def _reload_env():
    load_dotenv(_ENV_PATH, override=True)


def _llm_mode():
    _reload_env()
    return os.getenv("LLM_MODE", "mock").strip().lower()


def _get_client():
    _reload_env()
    mode = _llm_mode()

    if mode == "ollama":
        return OpenAI(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1"),
            api_key="ollama",
        )

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set.")
    return OpenAI(api_key=api_key)


def _template_answer(question, patient):
    name = getattr(patient, "name", None) or patient.get("name", "")
    symptoms = getattr(patient, "symptoms", None) or patient.get("symptoms", "")
    diagnosis = getattr(patient, "diagnosis", None) or patient.get("diagnosis", "")
    urgency = getattr(patient, "urgency", None) or patient.get("urgency", "")

    return f"""
Patient:

{name}

Symptoms:
{symptoms}

Diagnosis:
{diagnosis}

Urgency:
{urgency}

Question:
{question}

Reasoning:

This patient is classified as
{urgency}
because of the symptoms:

{symptoms}

Possible diagnosis:

{diagnosis}
"""


def _run_llm(prompt):
    mode = _llm_mode()
    model = os.getenv(
        "OLLAMA_MODEL" if mode == "ollama" else "OPENAI_MODEL",
        "llama3.2" if mode == "ollama" else "gpt-4o-mini",
    )
    client = _get_client()
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


def answer(question, patient):
    name = getattr(patient, "name", None) or patient.get("name", "")
    symptoms = getattr(patient, "symptoms", None) or patient.get("symptoms", "")
    diagnosis = getattr(patient, "diagnosis", None) or patient.get("diagnosis", "")
    urgency = getattr(patient, "urgency", None) or patient.get("urgency", "")

    if _llm_mode() not in ("openai", "ollama"):
        return _template_answer(question, patient)

    prompt = f"""
Patient:

Name:
{name}

Symptoms:
{symptoms}

Diagnosis:
{diagnosis}

Urgency:
{urgency}

Question:

{question}

Answer like an ophthalmologist.
"""

    try:
        return _run_llm(prompt)
    except Exception:
        return _template_answer(question, patient)
