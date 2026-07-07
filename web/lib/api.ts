export type Patient = {
  id: number;
  name: string;
  age: number;
  symptoms: string;
  diagnosis: string | null;
  urgency: string | null;
  laterality?: string;
  visual_acuity?: string;
  iop?: string;
  duration?: string;
  comorbidities?: string;
  icd10_codes?: string;
  confidence_pct?: number;
  review_status?: string;
  reviewer_note?: string;
  reviewed_at?: string;
  referral_action?: string;
  doctor_report?: string | null;
  patient_education?: string | null;
};

export type PipelineStep = {
  agent: string;
  label: string;
  status: string;
  output_preview: string;
};

export type PriorityCase = {
  id: number;
  name: string;
  age: number;
  urgency: string;
  symptoms: string;
};

export type DailyBrief = {
  total: number;
  red: number;
  yellow: number;
  green: number;
  narrative: string;
  priority_cases: PriorityCase[];
};

export type AuditEntry = {
  id: number;
  patient_id: number | null;
  event_type: string;
  detail: string;
  created_at: string;
};

export type HealthInfo = {
  status: string;
  engine: string;
  model: string;
  version?: string;
  compliance?: string;
};

function apiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    if (window.location.port === "3000") return "http://127.0.0.1:8000";
    return window.location.origin;
  }
  return "";
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${apiBase()}${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }
  return res;
}

export async function fetchHealth(): Promise<HealthInfo> {
  const res = await apiFetch("/api/health");
  return res.json();
}

export async function fetchPatients(): Promise<Patient[]> {
  const res = await apiFetch("/api/patients");
  return res.json();
}

export async function fetchDailyBrief(): Promise<DailyBrief> {
  const res = await apiFetch("/api/daily-brief");
  return res.json();
}

export async function fetchAuditTrail(): Promise<AuditEntry[]> {
  const res = await apiFetch("/api/audit");
  return res.json();
}

export async function submitIntake(data: {
  name: string;
  age: number;
  symptoms: string;
  laterality?: string;
  visual_acuity?: string;
  iop?: string;
  duration?: string;
  comorbidities?: string;
}) {
  const res = await apiFetch("/api/intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function submitAttestation(
  patientId: number,
  status: string,
  note: string = ""
) {
  const res = await apiFetch(`/api/patients/${patientId}/attestation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, note }),
  });
  return res.json();
}

export type PracticeOperations = {
  cases_automated: number;
  minutes_saved_total: number;
  hours_saved_total: number;
  staff_capacity_gain_percent: number;
  revenue_pipeline_usd: number;
  revenue_at_risk_prevented_usd: number;
  automation_rate_percent: number;
  charts_auto_drafted: number;
  physician_reviews_pending: number;
  avg_time_per_case_minutes: number;
  throughput_gain_percent: number;
  monthly_projection_usd: number;
};

export type SchedulingEntry = {
  id: number;
  name: string;
  urgency: string | null;
  scheduling_recommendation: string;
  referral_action?: string;
  review_status?: string;
};

export async function fetchReviewQueue(): Promise<Patient[]> {
  const res = await apiFetch("/api/review-queue");
  return res.json();
}

export async function fetchSchedulingDesk(): Promise<SchedulingEntry[]> {
  const res = await apiFetch("/api/scheduling");
  return res.json();
}

export async function fetchOperations(): Promise<PracticeOperations> {
  const res = await apiFetch("/api/operations");
  return res.json();
}

export function wsUrl(patientId: number) {
  const base = apiBase();
  const wsBase = base.replace(/^http/, "ws");
  return `${wsBase}/ws/copilot/${patientId}`;
}

export async function askCopilot(patientId: number, question: string) {
  const res = await apiFetch("/api/copilot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, question }),
  });
  return res.json();
}
