"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AttestationBar from "@/components/AttestationBar";
import ClinicalText from "@/components/ClinicalText";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import Icd10Badge from "@/components/Icd10Badge";
import Panel from "@/components/Panel";
import DownloadReport from "@/components/DownloadReport";
import ReferralPanel from "@/components/ReferralPanel";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient } from "@/lib/api";

type ReportTab = "attending" | "assessment" | "education";

export default function ReportsContent() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [tab, setTab] = useState<ReportTab>("attending");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients()
      .then((data) => {
        setPatients(data);
        const idParam = searchParams.get("id");
        if (idParam) {
          const match = data.find((p) => p.id === Number(idParam));
          if (match) {
            setSelected(match);
            return;
          }
        }
        if (data.length) setSelected(data[0]);
      })
      .catch((e) => setError(e.message));
  }, [searchParams]);

  if (error) return <div className="glass p-6 text-red-300">{error}</div>;
  if (!patients.length) return <div className="glass p-6 text-amber-300">No reports available.</div>;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b8cb8]">
          Attending reports with ICD-10, confidence, referral pathway, and export.
        </p>
        {selected && (
          <DownloadReport
            data={{
              patientName: selected.name,
              age: selected.age,
              urgency: selected.urgency,
              symptoms: selected.symptoms,
              diagnosis: selected.diagnosis,
              doctorReport: selected.doctor_report,
              icd10: selected.icd10_codes,
              laterality: selected.laterality,
            }}
            targetId="report-export"
          />
        )}
      </div>

      <select
        className="rounded-lg border border-border bg-panel px-4 py-2 text-white"
        value={selected?.id ?? ""}
        onChange={(e) =>
          setSelected(patients.find((p) => p.id === Number(e.target.value)) || null)
        }
      >
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.urgency} — {p.review_status || "pending"}
          </option>
        ))}
      </select>

      {selected && (
        <div id="report-export" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <UrgencyBadge urgency={selected.urgency} />
            <ConfidenceBadge pct={selected.confidence_pct || 0} />
          </div>
          <Icd10Badge codes={selected.icd10_codes} />
          <ReferralPanel action={selected.referral_action} />

          <div className="flex gap-2 border-b border-border pb-2">
            {(
              [
                ["attending", "Attending Report"],
                ["assessment", "Clinical Assessment"],
                ["education", "Patient Education"],
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              {tab === "attending" && (
                <Panel title="Attending Report">
                  <ClinicalText
                    text={selected.doctor_report || "Run a new intake to generate attending report."}
                    structured={false}
                  />
                </Panel>
              )}
              {tab === "assessment" && (
                <Panel title="Clinical Assessment">
                  <ClinicalText text={selected.diagnosis} />
                </Panel>
              )}
              {tab === "education" && (
                <Panel title="Patient Education">
                  <ClinicalText
                    text={selected.patient_education || "Patient education available for new cases."}
                    structured={false}
                  />
                </Panel>
              )}
            </div>
            <Panel title="Structured Presentation">
              <dl className="space-y-2 text-sm">
                <div><dt className="text-[#6b8cb8]">Patient</dt><dd>{selected.name}, {selected.age}y</dd></div>
                <div><dt className="text-[#6b8cb8]">Laterality</dt><dd>{selected.laterality || "OU"}</dd></div>
                <div><dt className="text-[#6b8cb8]">Visual Acuity</dt><dd>{selected.visual_acuity || "—"}</dd></div>
                <div><dt className="text-[#6b8cb8]">IOP</dt><dd>{selected.iop || "—"}</dd></div>
                <div><dt className="text-[#6b8cb8]">Duration</dt><dd>{selected.duration || "—"}</dd></div>
                <div><dt className="text-[#6b8cb8]">Comorbidities</dt><dd>{selected.comorbidities || "—"}</dd></div>
                <div><dt className="text-[#6b8cb8]">Chief Complaint</dt><dd>{selected.symptoms}</dd></div>
                <div><dt className="text-[#6b8cb8]">Review Status</dt><dd className="capitalize">{selected.review_status || "pending"}</dd></div>
              </dl>
            </Panel>
          </div>

          <AttestationBar
            patientId={selected.id}
            initialStatus={selected.review_status}
            initialNote={selected.reviewer_note}
            reviewedAt={selected.reviewed_at}
          />
        </div>
      )}
    </div>
  );
}
