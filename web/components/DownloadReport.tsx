"use client";

import { Download, Printer } from "lucide-react";
import { HOSPITAL, CURRENT_BRANCH } from "@/lib/hospital";

type ReportData = {
  patientName: string;
  age: number;
  urgency: string | null;
  symptoms: string;
  diagnosis: string | null;
  doctorReport?: string | null;
  icd10?: string;
  laterality?: string;
};

function buildReportHtml(data: ReportData) {
  const date = new Date().toLocaleString();
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Clinical Report — ${data.patientName}</title>
<style>
  body { font-family: 'Segoe UI', Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.6; }
  .header { border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px; }
  .header h1 { margin: 0; font-size: 1.4rem; color: #1e40af; }
  .header p { margin: 4px 0 0; font-size: 0.85rem; color: #555; }
  .section { margin-bottom: 20px; }
  .section h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 8px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 0.85rem; }
  .red { background: #fee2e2; color: #991b1b; }
  .yellow { background: #fef3c7; color: #92400e; }
  .green { background: #d1fae5; color: #065f46; }
  pre { white-space: pre-wrap; font-family: inherit; font-size: 0.9rem; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 0.75rem; color: #888; }
</style></head><body>
<div class="header">
  <h1>${HOSPITAL.name}</h1>
  <p>${CURRENT_BRANCH.name} · ${CURRENT_BRANCH.address}</p>
  <p>Clinical Report · Generated ${date}</p>
</div>
<div class="section">
  <h2>Patient</h2>
  <p><strong>${data.patientName}</strong> · ${data.age} years · ${data.laterality || "OU"}</p>
  <p>Triage: <span class="badge ${data.urgency === "RED" ? "red" : data.urgency === "YELLOW" ? "yellow" : "green"}">${data.urgency || "Pending"}</span></p>
  ${data.icd10 ? `<p>ICD-10: ${data.icd10}</p>` : ""}
</div>
<div class="section"><h2>Chief Complaint</h2><pre>${data.symptoms || ""}</pre></div>
<div class="section"><h2>Clinical Assessment</h2><pre>${data.diagnosis || ""}</pre></div>
${data.doctorReport ? `<div class="section"><h2>Attending Report</h2><pre>${data.doctorReport}</pre></div>` : ""}
<div class="footer">
  <p>Physician verification required before filing. Confidential patient health information — authorized use only.</p>
  <p>${HOSPITAL.phone} · ${HOSPITAL.email}</p>
</div>
</body></html>`;
}

export default function DownloadReport({
  data,
  targetId,
}: {
  data?: ReportData;
  targetId?: string;
}) {
  function getHtml(): string {
    if (data) return buildReportHtml(data);
    const el = targetId ? document.getElementById(targetId) : null;
    if (!el) return buildReportHtml({ patientName: "Report", age: 0, urgency: null, symptoms: "", diagnosis: "" });
    return `<!DOCTYPE html><html><head><title>VisionFlow Report</title>
    <style>body{font-family:Georgia,serif;padding:2rem;color:#111;line-height:1.6}
    h1{font-size:1.25rem;border-bottom:2px solid #1e40af;padding-bottom:.5rem;color:#1e40af}
    .meta{color:#555;font-size:.85rem;margin-bottom:1.5rem}</style></head><body>
    <h1>${HOSPITAL.name} — Clinical Report</h1>
    <p class="meta">${CURRENT_BRANCH.name} · ${new Date().toLocaleString()}</p>
    ${el.innerHTML}</body></html>`;
  }

  function download() {
    const html = getHtml();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VisionFlow-Report-${data?.patientName || "export"}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printReport() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(getHtml());
    win.document.close();
    win.print();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={download}
        className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-glow hover:bg-accent/20"
      >
        <Download size={14} />
        Download Report
      </button>
      <button
        type="button"
        onClick={printReport}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-slate-400 hover:text-white"
      >
        <Printer size={14} />
        Print PDF
      </button>
    </div>
  );
}
