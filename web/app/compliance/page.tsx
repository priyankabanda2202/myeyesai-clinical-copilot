"use client";

import { useEffect, useState } from "react";
import { fetchHealth, HealthInfo } from "@/lib/api";

export default function CompliancePage() {
  const [health, setHealth] = useState<HealthInfo | null>(null);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => null);
  }, []);

  const sections = [
    {
      title: "Intended Use",
      body: "VisionFlow Clinical Copilot is a clinical decision support (CDS) prototype for ophthalmology case review, triage assistance, and multi-agent reasoning demonstration. It is designed for stakeholder and clinician evaluation — not for autonomous diagnosis or treatment.",
    },
    {
      title: "Data Handling",
      body: "This deployment uses synthetic and de-identified demo data only. No real protected health information (PHI) should be entered. Production deployments would require HIPAA-compliant infrastructure, encryption at rest and in transit, access controls, and business associate agreements.",
    },
    {
      title: "Physician Responsibility",
      body: "All AI-generated assessments require independent verification by a licensed clinician. The attestation workflow (Accept / Modify / Reject) models physician-in-the-loop governance required for CDS compliance under FDA guidance and institutional policy.",
    },
    {
      title: "AI Transparency",
      body: "Model provider, version, and agent pipeline trace are disclosed for evaluators. Confidence scores and ICD-10 suggestions are AI-generated estimates — not coded billing determinations without physician review.",
    },
    {
      title: "Audit & Governance",
      body: "Intake completions, physician attestations, and clinical assistant queries are logged in the Audit Trail for accountability and quality review — a standard enterprise requirement for clinical AI systems.",
    },
    {
      title: "Limitations",
      body: "Does not replace slit-lamp examination, imaging interpretation, or emergency protocols. Triage rules and LLM outputs may contain errors. Always apply clinical judgment and local institutional pathways.",
    },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white">Compliance & Clinical Governance</h2>
        <p className="mt-2 text-sm text-[#6b8cb8]">
          Standard disclosures for healthcare AI evaluation and customer due diligence.
        </p>
        {health && (
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-border p-3">
              <p className="text-slate-500">Platform version</p>
              <p className="text-white">{health.version || "2.1.0"}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-slate-500">AI engine</p>
              <p className="text-white">{health.engine} / {health.model}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-slate-500">Data mode</p>
              <p className="text-white">{health.compliance || "synthetic-only"}</p>
            </div>
          </div>
        )}
      </div>

      {sections.map((s) => (
        <div key={s.title} className="glass p-6">
          <h3 className="font-medium text-white">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
