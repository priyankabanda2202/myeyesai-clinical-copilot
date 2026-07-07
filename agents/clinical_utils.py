import re

from agents.text_format import clean_clinical_text


def extract_confidence(analysis: str) -> int:
    if not analysis:
        return 0
    match = re.search(r"(\d{1,3})\s*%", analysis)
    if match:
        return min(int(match.group(1)), 100)
    return 0


def extract_icd10(text: str) -> str:
    if not text:
        return ""
    codes = re.findall(r"\b[A-TV-Z][0-9]{2}(?:\.[0-9A-Z]{1,4})?\b", text.upper())
    unique = []
    for code in codes:
        if code not in unique:
            unique.append(code)
    return ", ".join(unique[:6])


def referral_for_urgency(urgency: str) -> str:
    mapping = {
        "RED": "Same-day emergency ophthalmology referral — notify on-call team immediately.",
        "YELLOW": "Urgent ophthalmology review within 24–48 hours — schedule priority slot.",
        "GREEN": "Routine ophthalmology follow-up — standard appointment within 2–4 weeks.",
    }
    return mapping.get(urgency, mapping["GREEN"])
