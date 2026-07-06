from agents.ollama_client import chat


def analyze_patient(summary):
    prompt = f"""
You are a senior ophthalmology clinical reasoning engine.

Patient presentation:
{summary}

Provide a structured clinical assessment with:
1. Primary Diagnosis
2. Differential Diagnosis
3. Recommended Workup
4. Clinical Confidence (percentage)

Write in concise clinical language for an attending physician.
"""
    return chat(prompt)
