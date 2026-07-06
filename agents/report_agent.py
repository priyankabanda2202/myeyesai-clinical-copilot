def generate_doctor_report(analysis, urgency):
    return f"""CLINICAL REPORT

{analysis}

Triage Level: {urgency}
Referral: {"Immediate ophthalmology consultation" if urgency == "RED" else "Urgent review within 24-48 hours" if urgency == "YELLOW" else "Routine follow-up"}
"""
