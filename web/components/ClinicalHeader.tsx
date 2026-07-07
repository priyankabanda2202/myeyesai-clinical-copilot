"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { HOSPITAL } from "@/lib/hospital";
import { useBranch } from "@/lib/branchContext";
import PatientSearchBar from "@/components/PatientSearchBar";

export default function ClinicalHeader() {
  const [now, setNow] = useState(new Date());
  const { branch } = useBranch();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative mb-4 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-[#0a1628] via-[#0f1f35] to-[#0a1628] px-4 py-4 shadow-glow md:mb-5 md:px-6 md:py-5">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAwVjYwTTAgMzBINjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')] opacity-50" />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-accent-glow/80">
              {HOSPITAL.name}
            </p>
            <p className="truncate text-[10px] text-slate-500 md:text-xs">{branch.name}</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:bg-gradient-to-r md:from-white md:via-blue-100 md:to-accent-glow md:bg-clip-text md:text-3xl md:text-transparent">
              Clinical Operations
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-live/40 bg-live/10 px-3 py-1.5 text-[11px] font-semibold text-live md:text-sm">
            <span className="h-2 w-2 rounded-full bg-live live-pulse" />
            LIVE
          </div>
        </div>

        <p className="hidden text-sm text-slate-400 sm:block">
          Real-time triage · Automated documentation · Clinical decision support
        </p>

        <div className="hidden w-full md:block md:max-w-xs md:ml-auto">
          <PatientSearchBar />
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400 md:text-xs">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1 font-mono text-white">
            <Clock size={12} />
            {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </header>
  );
}
