"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { fetchAuditTrail, AuditEntry } from "@/lib/api";

function exportCsv(logs: AuditEntry[]) {
  const header = "Time,Event,Case ID,Detail\n";
  const rows = logs
    .map(
      (l) =>
        `"${l.created_at}","${l.event_type.replace(/"/g, '""')}","${l.patient_id ?? ""}","${l.detail.replace(/"/g, '""')}"`
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `VisionFlow-Audit-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuditTrail()
      .then(setLogs)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6b8cb8]">
          Immutable activity log for clinical governance — intakes, attestations, and assistant queries.
        </p>
        {logs.length > 0 && (
          <button
            type="button"
            onClick={() => exportCsv(logs)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs text-accent-glow hover:bg-accent/20"
          >
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>
      {error && <div className="glass p-4 text-red-300">{error}</div>}
      <div className="glass overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-canvas/50 text-xs uppercase text-[#6b8cb8]">
            <tr>
              <th className="px-4 py-3">Time (UTC)</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/50 text-slate-300">
                <td className="px-4 py-3 font-mono text-xs">{log.created_at.slice(0, 19)}</td>
                <td className="px-4 py-3">{log.event_type.replace(/_/g, " ")}</td>
                <td className="px-4 py-3">{log.patient_id ?? "—"}</td>
                <td className="px-4 py-3 text-xs">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs.length && !error && (
          <p className="p-6 text-slate-500">No audit events yet — run an intake to begin.</p>
        )}
      </div>
    </div>
  );
}
