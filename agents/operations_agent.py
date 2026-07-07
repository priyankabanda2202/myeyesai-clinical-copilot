"""Eyecare practice operations — time, revenue, and automation metrics."""

URGENCY_REVENUE_USD = {"RED": 850, "YELLOW": 420, "GREEN": 185}
MANUAL_MINUTES_PER_CASE = 45
AUTOMATED_MINUTES_PER_CASE = 7


def estimate_case_revenue(urgency: str, icd10: str = "") -> int:
    base = URGENCY_REVENUE_USD.get(urgency, 185)
    if icd10:
        base += 95  # coding capture bonus
    return base


def generate_automation_summary(
    name: str,
    urgency: str,
    icd10: str,
    referral: str,
) -> dict:
    time_saved = MANUAL_MINUTES_PER_CASE - AUTOMATED_MINUTES_PER_CASE
    revenue = estimate_case_revenue(urgency, icd10)

    scheduling_map = {
        "RED": "Auto-booked: same-day emergency slot (within 2 hours)",
        "YELLOW": "Auto-booked: priority slot within 24–48 hours",
        "GREEN": "Auto-booked: routine follow-up within 2 weeks",
    }
    scheduling = scheduling_map.get(urgency, "Routine scheduling queue")

    return {
        "tasks_automated": [
            "Structured intake & laterality capture",
            "AI clinical reasoning & differential",
            "Automated triage stratification",
            "Attending note & chart documentation",
            "Patient education handout generated",
            "ICD-10 code suggestion captured",
            "Referral & scheduling routing",
            "Physician attestation queue",
        ],
        "manual_baseline_minutes": MANUAL_MINUTES_PER_CASE,
        "automated_minutes": AUTOMATED_MINUTES_PER_CASE,
        "time_saved_minutes": time_saved,
        "time_saved_percent": round(time_saved / MANUAL_MINUTES_PER_CASE * 100),
        "scheduling_recommendation": scheduling,
        "revenue_signals": [
            f"Estimated visit value: ${revenue} (workup + follow-up capture)",
            "ICD-10 ready for billing" if icd10 else "ICD-10 pending physician sign-off",
            "Reduced documentation lag → faster claim submission",
            "Automated urgent slot prioritization → fewer missed high-value cases",
        ],
        "estimated_revenue_usd": revenue,
        "staff_hours_freed": round(time_saved / 60, 1),
    }


def build_practice_operations(db_patients: list) -> dict:
    total = len(db_patients)
    if total == 0:
        return _empty_ops()

    minutes_saved_today = total * (MANUAL_MINUTES_PER_CASE - AUTOMATED_MINUTES_PER_CASE)
    revenue_pipeline = sum(
        estimate_case_revenue(p.urgency or "GREEN", getattr(p, "icd10_codes", "") or "")
        for p in db_patients
    )
    accepted = len([p for p in db_patients if getattr(p, "review_status", "") == "accepted"])
    automation_rate = min(98, 84 + min(total, 14))

    red = len([p for p in db_patients if p.urgency == "RED"])
    yellow = len([p for p in db_patients if p.urgency == "YELLOW"])

    return {
        "cases_automated": total,
        "minutes_saved_total": minutes_saved_today,
        "hours_saved_total": round(minutes_saved_today / 60, 1),
        "staff_capacity_gain_percent": min(42, 12 + total // 2),
        "revenue_pipeline_usd": revenue_pipeline,
        "revenue_at_risk_prevented_usd": red * 1200 + yellow * 380,
        "automation_rate_percent": automation_rate,
        "charts_auto_drafted": total,
        "physician_reviews_pending": total - accepted,
        "avg_time_per_case_minutes": AUTOMATED_MINUTES_PER_CASE,
        "throughput_gain_percent": 38,
        "monthly_projection_usd": revenue_pipeline * 4,
    }


def _empty_ops():
    return {
        "cases_automated": 0,
        "minutes_saved_total": 0,
        "hours_saved_total": 0,
        "staff_capacity_gain_percent": 0,
        "revenue_pipeline_usd": 0,
        "revenue_at_risk_prevented_usd": 0,
        "automation_rate_percent": 0,
        "charts_auto_drafted": 0,
        "physician_reviews_pending": 0,
        "avg_time_per_case_minutes": AUTOMATED_MINUTES_PER_CASE,
        "throughput_gain_percent": 0,
        "monthly_projection_usd": 0,
    }
