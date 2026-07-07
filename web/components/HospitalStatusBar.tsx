"use client";

import { useBranch } from "@/lib/branchContext";
import { BRANCHES } from "@/lib/hospital";
import { ChevronDown, MapPin, Shield } from "lucide-react";

export default function HospitalStatusBar() {
  const { branch, setBranchId } = useBranch();

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-panel/50 px-4 py-2.5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-slate-300">
          <MapPin size={13} className="text-accent-glow" />
          Active site:
        </span>
        <div className="relative">
          <select
            value={branch.id}
            onChange={(e) => setBranchId(e.target.value)}
            className="appearance-none rounded-lg border border-border/60 bg-canvas/80 py-1 pl-2 pr-7 text-xs font-semibold text-white"
          >
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <span className="hidden text-slate-500 sm:inline">|</span>
        <span className="text-slate-400">{branch.hours.split("·")[0].trim()}</span>
        <span className="hidden text-slate-500 md:inline">|</span>
        <span className="hidden text-slate-400 md:inline">{branch.phone}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-live/25 bg-live/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-live">
          <span className="h-1.5 w-1.5 rounded-full bg-live live-pulse" />
          Systems Online
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <Shield size={12} />
          HIPAA Secure Session
        </span>
      </div>
    </div>
  );
}
