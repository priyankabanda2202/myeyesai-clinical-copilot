"use client";

import Link from "next/link";
import { useState } from "react";
import AgentTrace from "@/components/AgentTrace";
import AttestationBar from "@/components/AttestationBar";
import ClinicalText from "@/components/ClinicalText";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import Icd10Badge from "@/components/Icd10Badge";
import Panel from "@/components/Panel";
import ReferralPanel from "@/components/ReferralPanel";
import SampleCasePicker from "@/components/SampleCasePicker";
import UrgencyBadge from "@/components/UrgencyBadge";
import { submitIntake } from "@/lib/api";

const PIPELINE_STEPS = [
  "Intake normalization",
  "Clinical reasoning",
  "Urgency stratification",
  "Attending report",
  "Patient education",
];

type ResultTab = "assessment" | "report" | "education" | "trace";

export default function IntakePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(40);
  const [symptoms, setSymptoms] = useState("");
  const [laterality, setLaterality] = useState("OU");
  const [visualAcuity, setVisualAcuity] = useState("");
  const [iop, setIop] = useState("");
  const [duration, setDuration] = useState("");
  const [comorbidities, setComorbidities] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<ResultTab>("assessment");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setStep(0);
    setTab("assessment");

    const timer = setInterval(() => {
      setStep((s) => Math.min(s + 1, PIPELINE_STEPS.length - 1));
    }, 800);

    try {
      const data = await submitIntake({
        name,
        age,
        symptoms,
        laterality,
        visual_acuity: visualAcuity,
        iop,
        duration,
        comorbidities,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(PIPELINE_STEPS.length);
    }
  }

  function loadDemo(c: (typeof import("@/lib/demoCases").DEMO_CASES)[number]) {
    setName(c.name);
    setAge(c.age);
    setSymptoms(c.symptoms);
    setLaterality(c.laterality);
    setVisualAcuity(c.visual_acuity);
    setIop(c.iop);
    setDuration(c.duration);
    setComorbidities(c.comorbidities);
  }

  return (
    <div className="animate-fade-up grid grid-cols-2 gap-8">
      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white">Structured Patient Intake</h2>
        <p className="mt-1 text-sm text-[#6b8cb8]">
          Ophthalmology-specific fields required for clinical decision support.
        </p>
        <SampleCasePicker onSelect={loadDemo} />
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            className="field-input"
            placeholder="Patient identifier (de-identified)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="field-input"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min={0}
              max={120}
            />
            <select
              className="field-input"
              value={laterality}
              onChange={(e) => setLaterality(e.target.value)}
            >
              <option value="OU">Both eyes (OU)</option>
              <option value="OD">Right eye (OD)</option>
              <option value="OS">Left eye (OS)</option>
            </select>
          </div>
          <input
            className="field-input"
            placeholder="Visual acuity (e.g. 20/40 OD, 20/20 OS)"
            value={visualAcuity}
            onChange={(e) => setVisualAcuity(e.target.value)}
          />
          <input
            className="field-input"
            placeholder="IOP (e.g. 16 OD / 15 OS mmHg)"
            value={iop}
            onChange={(e) => setIop(e.target.value)}
          />
          <input
            className="field-input"
            placeholder="Symptom duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <input
            className="field-input"
            placeholder="Comorbidities (diabetes, HTN, etc.)"
            value={comorbidities}
            onChange={(e) => setComorbidities(e.target.value)}
          />
          <textarea
            className="field-input h-28"
            placeholder="Chief complaint and examination findings"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Running clinical pipeline…" : "Run Clinical Pipeline"}
          </button>
        </form>
      </div>

      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white">Pipeline Output</h2>

        {loading && (
          <div className="mt-6 space-y-3">
            {PIPELINE_STEPS.map((label, i) => (
              <div key={label} className={`flex gap-2 text-sm ${i <= step ? "text-live" : "text-slate-600"}`}>
                <span>{i < step ? "✓" : i === step ? "●" : "○"}</span>
                {label}
              </div>
            ))}
          </div>
        )}

        {!loading && error && <p className="mt-6 text-sm text-red-400">{error}</p>}
        {!loading && !error && !result && (
          <p className="mt-8 text-[#6b8cb8]">Load a demo case or enter structured presentation data.</p>
        )}

        {!loading && result && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <UrgencyBadge urgency={result.urgency} />
              <ConfidenceBadge pct={result.confidence_pct} />
            </div>
            <Icd10Badge codes={result.icd10_codes} />
            <ReferralPanel action={result.referral_action} />

            <div className="flex flex-wrap gap-2 border-b border-border pb-2">
              {(
                [
                  ["assessment", "Assessment"],
                  ["report", "Attending Report"],
                  ["education", "Patient Education"],
                  ["trace", "Agent Trace"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs ${
                    tab === key ? "bg-accent/20 text-white" : "text-slate-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "assessment" && (
              <Panel title="Clinical Assessment">
                <ClinicalText text={result.analysis} />
              </Panel>
            )}
            {tab === "report" && (
              <Panel title="Attending Report">
                <ClinicalText text={result.doctor_report} structured={false} />
              </Panel>
            )}
            {tab === "education" && (
              <Panel title="Patient Education">
                <ClinicalText text={result.patient_education} structured={false} />
              </Panel>
            )}
            {tab === "trace" && <AgentTrace steps={result.pipeline_trace} />}

            <AttestationBar patientId={result.patient?.id} />

            {result.patient?.id && (
              <div className="flex gap-3">
                <Link href={`/reports/?id=${result.patient.id}`} className="text-sm text-live hover:underline">
                  Open in Reports →
                </Link>
                <Link href={`/assistant/?id=${result.patient.id}`} className="text-sm text-live hover:underline">
                  Clinical Assistant →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
