"use client";

import { useEffect, useState } from "react";
import { fetchHealth, HealthInfo } from "@/lib/api";
import { HOSPITAL } from "@/lib/hospital";
import { Shield } from "lucide-react";

export default function CompliancePage() {
  const [health, setHealth] = useState<HealthInfo | null>(null);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => null);
  }, []);

  const sections = [
    {
      title: "Privacy & HIPAA Compliance",
      body: `${HOSPITAL.name} maintains full HIPAA compliance across all clinical systems. Patient data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access is role-based with full audit logging. Business Associate Agreements are in place with all technology vendors.`,
    },
    {
      title: "Clinical Decision Support Policy",
      body: "VisionFlow Clinical Copilot provides AI-assisted clinical decision support to licensed ophthalmologists and credentialed staff. All AI-generated assessments require independent physician verification and attestation before entering the permanent medical record.",
    },
    {
      title: "Data Retention & Security",
      body: "Clinical records are retained per institutional policy (minimum 7 years). Automated backups occur every 4 hours across geographically redundant data centers. Security incidents are reported per institutional IR policy within 24 hours.",
    },
    {
      title: "Physician Responsibilities",
      body: "Attending physicians must review, accept, modify, or reject all AI-generated clinical outputs using the attestation workflow. Final diagnostic and treatment decisions remain solely with the licensed provider.",
    },
    {
      title: "System Transparency",
      body: "AI model provider, version, and agent pipeline outputs are logged and available for quality review. Confidence scores and ICD-10 suggestions are advisory — billing codes require physician approval.",
    },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="glass p-6">
        <div className="flex items-center gap-2">
          <Shield size={22} className="text-live" />
          <h2 className="text-lg font-semibold text-white">Privacy, Security & Clinical Governance</h2>
        </div>
        <p className="mt-2 text-sm text-slate-400">{HOSPITAL.name} — Institutional policies</p>
        {health && (
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-border p-3">
              <p className="text-slate-500">Platform</p>
              <p className="text-white">v{health.version || "2.1.0"}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-slate-500">AI Engine</p>
              <p className="text-white">{health.engine}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-slate-500">Security</p>
              <p className="text-live">HIPAA Compliant</p>
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
