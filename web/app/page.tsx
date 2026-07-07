"use client";

import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import LiveStatusBar from "@/components/LiveStatusBar";
import LiveTriageQueue from "@/components/LiveTriageQueue";
import PremiumMetricCard from "@/components/PremiumMetricCard";
import UrgencyBadge from "@/components/UrgencyBadge";
import ReviewQueuePanel from "@/components/ReviewQueuePanel";
import ValuePropositionBanner from "@/components/ValuePropositionBanner";
import { useLiveData } from "@/hooks/useLiveData";
import { useEffect, useState } from "react";
import { fetchOperations, PracticeOperations } from "@/lib/api";

export default function DashboardPage() {
  const { brief, patients, activity, lastSync, connected, loading, refresh } = useLiveData(5000);
  const [ops, setOps] = useState<PracticeOperations | null>(null);

  useEffect(() => {
    fetchOperations().then(setOps).catch(() => null);
  }, [brief?.total]);

  const chartData = [
    { name: "Critical", value: brief?.red ?? 0, fill: "#ef4444" },
    { name: "Urgent", value: brief?.yellow ?? 0, fill: "#f59e0b" },
    { name: "Routine", value: brief?.green ?? 0, fill: "#22c55e" },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <LiveStatusBar connected={connected} lastSync={lastSync} onRefresh={refresh} />
      <ValuePropositionBanner />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <PremiumMetricCard label="Hours Saved" value={Math.round(ops?.hours_saved_total ?? 0)} icon={Clock} accent="#10b981" loading={loading} />
        <PremiumMetricCard label="Revenue Pipeline ($K)" value={Math.round((ops?.revenue_pipeline_usd ?? 0) / 1000)} icon={DollarSign} accent="#d4a853" loading={loading} />
        <PremiumMetricCard label="Automation" value={ops?.automation_rate_percent ?? 0} icon={TrendingUp} accent="#3b82f6" loading={loading} />
        <PremiumMetricCard label="Active Caseload" value={brief?.total ?? 0} icon={Users} accent="#8b5cf6" loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        <Link href="/operations/" className="glass-hover group p-5">
          <p className="font-semibold text-gold group-hover:text-yellow-300">Practice ROI Hub →</p>
          <p className="mt-1 text-xs text-slate-400">Time saved, revenue capture, automation breakdown</p>
        </Link>
        <Link href="/live/" className="glass-hover group p-5">
          <p className="font-semibold text-white group-hover:text-live">Live Triage Board →</p>
          <p className="mt-1 text-xs text-slate-400">Real-time emergency & urgent lanes</p>
        </Link>
        <Link href="/intake/" className="glass-hover group p-5">
          <p className="font-semibold text-white group-hover:text-accent-glow">Automate New Case →</p>
          <p className="mt-1 text-xs text-slate-400">~38 min saved per intake · billing-ready documentation</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-live live-pulse" />
            Live Triage Queue
          </h2>
          <LiveTriageQueue patients={patients} />
        </div>
        <ReviewQueuePanel patients={patients} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass p-6">
          <h3 className="mb-4 font-semibold text-white">Caseload Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0c1422", border: "1px solid #1a2d4a", borderRadius: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <LiveActivityFeed activity={activity} />
      </div>

      {brief?.priority_cases && brief.priority_cases.length > 0 && (
        <div className="glass p-6">
          <h3 className="font-semibold text-white">High-Value Cases — Revenue at Risk if Missed</h3>
          <div className="mt-4 space-y-2">
            {brief.priority_cases.slice(0, 5).map((p) => (
              <Link key={p.id} href={`/reports/?id=${p.id}`} className="live-queue-item">
                <div>
                  <p className="font-medium text-white">{p.name} · {p.age}y</p>
                  <p className="text-xs text-slate-400">{p.symptoms}</p>
                </div>
                <UrgencyBadge urgency={p.urgency} compact />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
