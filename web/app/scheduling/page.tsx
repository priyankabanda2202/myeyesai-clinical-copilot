"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchSchedulingDesk, SchedulingEntry } from "@/lib/api";
import { useBranch } from "@/lib/branchContext";

export default function SchedulingPage() {
  const { branch } = useBranch();
  const [entries, setEntries] = useState<SchedulingEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedulingDesk()
      .then(setEntries)
      .catch((e) => setError(e.message));
  }, []);

  const emergency = entries.filter((e) => e.urgency === "RED");
  const urgent = entries.filter((e) => e.urgency === "YELLOW");
  const routine = entries.filter((e) => e.urgency === "GREEN");

  const lanes = [
    { title: "Same-Day Emergency", items: emergency, color: "border-critical/40" },
    { title: "Priority (24–48 hr)", items: urgent, color: "border-urgent/40" },
    { title: "Routine Follow-Up", items: routine.slice(0, 10), color: "border-routine/40" },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="glass p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Scheduling Desk</h2>
            <p className="mt-1 text-sm text-slate-400">
              Auto-routed appointment slots · {branch.name}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={14} />
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {error && <div className="glass p-4 text-red-300">{error}</div>}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {lanes.map(({ title, items, color }) => (
          <div key={title} className={`glass p-4 ${color}`}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <span className="text-xs text-slate-400">{items.length} booked</span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">No slots in this lane</p>
              ) : (
                items.map((e) => (
                  <Link
                    key={e.id}
                    href={`/reports/?id=${e.id}`}
                    className="block rounded-lg border border-border/50 bg-canvas/40 p-3 hover:border-accent/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white">{e.name}</p>
                      <UrgencyBadge urgency={e.urgency} compact />
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-live">
                      <Clock size={11} />
                      {e.scheduling_recommendation.replace("Auto-booked: ", "")}
                    </p>
                    {e.referral_action && (
                      <p className="mt-1 text-[10px] text-slate-500">{e.referral_action.slice(0, 80)}</p>
                    )}
                    <p className="mt-1 text-[10px] capitalize text-slate-600">
                      Chart: {e.review_status || "pending review"}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
