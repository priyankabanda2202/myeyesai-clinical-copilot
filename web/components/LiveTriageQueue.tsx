"use client";

import Link from "next/link";
import { AlertTriangle, Clock, User } from "lucide-react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { Patient } from "@/lib/api";

export default function LiveTriageQueue({ patients }: { patients: Patient[] }) {
  const critical = patients.filter((p) => p.urgency === "RED");
  const urgent = patients.filter((p) => p.urgency === "YELLOW");
  const routine = patients.filter((p) => p.urgency === "GREEN");

  const lanes = [
    { key: "RED", label: "Emergency Lane", icon: AlertTriangle, items: critical, color: "border-critical/40 bg-critical/5" },
    { key: "YELLOW", label: "Urgent Lane", icon: Clock, items: urgent.slice(0, 6), color: "border-urgent/40 bg-urgent/5" },
    { key: "GREEN", label: "Routine Lane", icon: User, items: routine.slice(0, 4), color: "border-routine/40 bg-routine/5" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {lanes.map(({ key, label, icon: Icon, items, color }) => (
        <div key={key} className={`glass rounded-2xl p-4 ${color}`}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon size={16} className={key === "RED" ? "text-critical" : key === "YELLOW" ? "text-urgent" : "text-routine"} />
              <h3 className="text-sm font-semibold text-white">{label}</h3>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
              {items.length}
            </span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-500">No cases in queue</p>
            ) : (
              items.map((p) => (
                <Link
                  key={p.id}
                  href={`/reports/?id=${p.id}`}
                  className={`live-queue-item block ${p.urgency === "RED" ? "animate-pulse-soft border-critical/30" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{p.name}</p>
                    <p className="truncate text-[11px] text-slate-400">{p.symptoms?.slice(0, 60)}</p>
                  </div>
                  <UrgencyBadge urgency={p.urgency} compact />
                </Link>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
