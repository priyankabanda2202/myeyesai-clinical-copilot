"use client";

import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { Patient } from "@/lib/api";

export default function ReviewQueuePanel({ patients }: { patients: Patient[] }) {
  const pending = patients
    .filter((p) => !p.review_status || p.review_status === "pending")
    .slice(0, 8);

  if (!pending.length) {
    return (
      <div className="glass p-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={18} className="text-live" />
          <h3 className="font-semibold text-white">Physician Review Queue</h3>
        </div>
        <p className="mt-3 text-sm text-slate-400">All cases attested — queue clear.</p>
      </div>
    );
  }

  return (
    <div className="glass p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={18} className="text-gold" />
          <h3 className="font-semibold text-white">Physician Review Queue</h3>
        </div>
        <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-bold text-gold">
          {pending.length} pending
        </span>
      </div>
      <div className="space-y-2">
        {pending.map((p) => (
          <Link
            key={p.id}
            href={`/reports/?id=${p.id}`}
            className="live-queue-item flex items-center justify-between"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{p.name} · {p.age}y</p>
              <p className="truncate text-[11px] text-slate-400">{p.symptoms?.slice(0, 70)}</p>
            </div>
            <UrgencyBadge urgency={p.urgency} compact />
          </Link>
        ))}
      </div>
      <Link href="/review/" className="mt-3 inline-block text-xs text-accent-glow hover:underline">
        Open full review desk →
      </Link>
    </div>
  );
}
