def generate_patient_education(symptoms, diagnosis, urgency):
    urgency_note = {
        "RED": "This is a high-urgency situation. Seek emergency eye care immediately.",
        "YELLOW": "Please schedule an urgent appointment with your eye specialist soon.",
        "GREEN": "Follow up with your eye doctor at your next routine visit.",
    }.get(urgency, "Please consult your eye care provider.")

    return f"""PATIENT SUMMARY

Your symptoms: {symptoms}

What we found: {diagnosis[:300]}{"..." if len(diagnosis or "") > 300 else ""}

Next steps: {urgency_note}
"""
