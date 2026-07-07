"use client";

import { CheckCircle2, Clock, DollarSign, Zap } from "lucide-react";

export type AutomationData = {
  tasks_automated: string[];
  manual_baseline_minutes: number;
  automated_minutes: number;
  time_saved_minutes: number;
  time_saved_percent: number;
  scheduling_recommendation: string;
  revenue_signals: string[];
  estimated_revenue_usd: number;
  staff_hours_freed: number;
};

export default function AutomationPanel({ data }: { data: AutomationData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-live/30 bg-live/5 p-4 text-center">
          <Clock className="mx-auto text-live" size={22} />
          <p className="mt-2 text-2xl font-bold text-white">{data.time_saved_minutes}m</p>
          <p className="text-[11px] text-slate-400">saved this case</p>
          <p className="mt-1 text-xs text-live">{data.time_saved_percent}% faster</p>
        </div>
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center">
          <DollarSign className="mx-auto text-gold" size={22} />
          <p className="mt-2 text-2xl font-bold text-white">${data.estimated_revenue_usd}</p>
          <p className="text-[11px] text-slate-400">revenue capture est.</p>
        </div>
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
          <Zap className="mx-auto text-accent-glow" size={22} />
          <p className="mt-2 text-2xl font-bold text-white">{data.tasks_automated.length}</p>
          <p className="text-[11px] text-slate-400">tasks automated</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-canvas/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Time comparison
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-slate-500">Manual workflow</p>
            <div className="mt-1 h-3 rounded-full bg-red-500/30">
              <div className="h-full w-full rounded-full bg-red-500/60" />
            </div>
            <p className="mt-1 text-sm text-red-300">{data.manual_baseline_minutes} min</p>
          </div>
          <span className="text-slate-500">→</span>
          <div className="flex-1">
            <p className="text-xs text-slate-500">VisionFlow automated</p>
            <div className="mt-1 h-3 rounded-full bg-live/20">
              <div
                className="h-full rounded-full bg-live"
                style={{ width: `${(data.automated_minutes / data.manual_baseline_minutes) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-live">{data.automated_minutes} min</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
        <p className="text-xs font-bold uppercase text-accent-glow">Auto-scheduling</p>
        <p className="mt-2 text-sm text-slate-200">{data.scheduling_recommendation}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase text-slate-400">Automated for you</p>
        <ul className="space-y-1.5">
          {data.tasks_automated.map((task) => (
            <li key={task} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-live" />
              {task}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase text-gold">Revenue impact</p>
        <ul className="space-y-1 text-sm text-slate-400">
          {data.revenue_signals.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
