"use client";

import { Activity } from "lucide-react";
import { AuditEntry } from "@/lib/api";

const EVENT_COLORS: Record<string, string> = {
  intake_completed: "text-live",
  physician_attestation: "text-gold",
  copilot_query: "text-accent-glow",
};

export default function LiveActivityFeed({ activity }: { activity: AuditEntry[] }) {
  return (
    <div className="glass p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={18} className="text-live" />
        <h3 className="font-semibold text-white">Live Activity Stream</h3>
        <span className="ml-auto h-2 w-2 rounded-full bg-live live-pulse" />
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {activity.length === 0 ? (
          <p className="text-sm text-slate-500">Waiting for clinical events…</p>
        ) : (
          activity.map((log) => (
            <div
              key={log.id}
              className="flex gap-3 rounded-lg border border-border/40 bg-canvas/40 px-3 py-2.5 text-xs"
            >
              <span className="shrink-0 font-mono text-slate-500">
                {log.created_at.slice(11, 19)}
              </span>
              <div className="min-w-0">
                <p className={`font-semibold capitalize ${EVENT_COLORS[log.event_type] || "text-slate-300"}`}>
                  {log.event_type.replace(/_/g, " ")}
                </p>
                <p className="truncate text-slate-400">{log.detail}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
