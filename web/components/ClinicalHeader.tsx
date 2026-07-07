"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";

export default function ClinicalHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative mb-5 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-[#0a1628] via-[#0f1f35] to-[#0a1628] px-6 py-5 shadow-glow">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAwVjYwTTAgMzBINjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')] opacity-50" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-glow/80">
            Ophthalmology · Clinical Decision Support
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-white via-blue-100 to-accent-glow bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
            VisionFlow Eye Hospital Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time triage · Multi-agent reasoning · Physician-governed AI
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 rounded-full border border-live/40 bg-live/10 px-4 py-2 text-sm font-semibold text-live shadow-glow-live">
            <span className="h-2.5 w-2.5 rounded-full bg-live live-pulse" />
            LIVE OPERATIONS
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1 font-mono text-white">
              <Clock size={12} />
              {now.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
