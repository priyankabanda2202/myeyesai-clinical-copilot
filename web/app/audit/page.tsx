"use client";

import { useEffect, useState } from "react";
import { fetchAuditTrail, AuditEntry } from "@/lib/api";

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
      <p className="text-sm text-[#6b8cb8]">
        Immutable-style activity log for clinical governance — intakes, attestations, and assistant queries.
      </p>
      {error && <div className="glass p-4 text-red-300">{error}</div>}
      <div className="glass overflow-hidden">
        <table className="w-full text-left text-sm">
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
