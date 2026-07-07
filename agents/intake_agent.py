def intake_summary(
    name,
    age,
    symptoms,
    laterality="OU",
    visual_acuity="",
    iop="",
    duration="",
    comorbidities="",
):
    return f"""
Patient Identifier: {name}
Age: {age}
Laterality: {laterality}
Visual Acuity: {visual_acuity or "Not recorded"}
Intraocular Pressure: {iop or "Not recorded"}
Symptom Duration: {duration or "Not specified"}
Comorbidities: {comorbidities or "None reported"}

Chief Complaint and Presentation:
{symptoms}
"""
