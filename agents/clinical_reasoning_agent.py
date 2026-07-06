import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
_client = None


def _reload_env():
    load_dotenv(_ENV_PATH, override=True)


def _llm_mode():
    _reload_env()
    return os.getenv("LLM_MODE", "mock").strip().lower()


def _get_client():
    global _client
    _reload_env()
    mode = _llm_mode()

    if mode == "ollama":
        return OpenAI(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1"),
            api_key="ollama",
        )

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError(
            "OPENAI_API_KEY is not set. Set LLM_MODE=mock for free testing."
        )
    return OpenAI(api_key=api_key)


def _mock_analysis(summary):
    text = summary.lower()

    if "vision loss" in text or "sudden vision" in text:
        return """**1 Diagnosis**
Central Retinal Artery Occlusion (CRAO) - suspected

**2 Differential Diagnosis**
- Retinal detachment
- Vitreous hemorrhage
- Ischemic optic neuropathy
- Acute angle-closure glaucoma

**3 Recommended Tests**
- Urgent dilated fundoscopy (both eyes)
- OCT macula
- Blood pressure; ESR/CRP if giant cell arteritis suspected
- Consider carotid Doppler if embolic etiology

**4 Confidence Score**
72%

*(Demo mode - for testing only, not for clinical use)*"""

    if "eye pain" in text or "red eye" in text:
        return """**1 Diagnosis**
Acute anterior uveitis - suspected

**2 Differential Diagnosis**
- Acute angle-closure glaucoma
- Keratitis
- Scleritis
- Conjunctivitis

**3 Recommended Tests**
- Slit-lamp examination
- Intraocular pressure measurement
- Fluorescein staining
- Consider syphilis/TB workup if recurrent

**4 Confidence Score**
65%

*(Demo mode - for testing only, not for clinical use)*"""

    if "blurr" in text or "blurry" in text:
        return """**1 Diagnosis**
Refractive error / early cataract - suspected

**2 Differential Diagnosis**
- Diabetic retinopathy
- Dry eye syndrome
- Macular degeneration
- Corneal opacity

**3 Recommended Tests**
- Visual acuity (Snellen chart)
- Refraction
- Slit-lamp examination
- Dilated fundoscopy

**4 Confidence Score**
58%

*(Demo mode - for testing only, not for clinical use)*"""

    return """**1 Diagnosis**
General ophthalmic evaluation required

**2 Differential Diagnosis**
- Refractive error
- Dry eye syndrome
- Conjunctivitis
- Early cataract

**3 Recommended Tests**
- Visual acuity assessment
- Slit-lamp examination
- Intraocular pressure
- Dilated fundoscopy as indicated

**4 Confidence Score**
50%

*(Demo mode - for testing only, not for clinical use)*"""


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


def analyze_patient(summary):
    mode = _llm_mode()

    if mode not in ("openai", "ollama"):
        return _mock_analysis(summary)

    prompt = f"""
    You are an ophthalmology AI assistant.

    Based on:

    {summary}

    Generate:

    1 Diagnosis
    2 Differential Diagnosis
    3 Recommended Tests
    4 Confidence Score
    """

    try:
        return _run_llm(prompt)
    except Exception:
        return _mock_analysis(summary)
