def get_urgency(symptoms):

    symptoms = symptoms.lower()

    if "vision loss" in symptoms:
        return "RED"

    if "eye pain" in symptoms:
        return "YELLOW"

    return "GREEN"