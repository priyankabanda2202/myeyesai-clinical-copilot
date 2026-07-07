"use client";

import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, Clock, Users } from "lucide-react";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import LiveStatusBar from "@/components/LiveStatusBar";
import LiveTriageQueue from "@/components/LiveTriageQueue";
import PremiumMetricCard from "@/components/PremiumMetricCard";
import UrgencyBadge from "@/components/UrgencyBadge";
import { useLiveData } from "@/hooks/useLiveData";

const QUICK_ACTIONS = [
  { href: "/live/", label: "Live Triage Board", desc: "Real-time emergency lanes" },
  { href: "/intake/", label: "New Intake", desc: "Submit or load demo case" },
  { href: "/assistant/", label: "Clinical Assistant", desc: "Live case consultation" },
];

export default function DashboardPage() {
  const { brief, patients, activity, lastSync, connected, loading, refresh } = useLiveData(5000);

  const chartData = [
    { name: "Critical", value: brief?.red ?? 0, fill: "#ef4444" },
    { name: "Urgent", value: brief?.yellow ?? 0, fill: "#f59e0b" },
    { name: "Routine", value: brief?.green ?? 0, fill: "#22c55e" },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <LiveStatusBar connected={connected} lastSync={lastSync} onRefresh={refresh} />

      <div className="grid grid-cols-4 gap-4">
        <PremiumMetricCard label="Active Caseload" value={brief?.total ?? 0} icon={Users} accent="#3b82f6" loading={loading} />
        <PremiumMetricCard label="Critical" value={brief?.red ?? 0} icon={AlertTriangle} accent="#ef4444" loading={loading} pulse={(brief?.red ?? 0) > 0} />
        <PremiumMetricCard label="Urgent" value={brief?.yellow ?? 0} icon={Clock} accent="#f59e0b" loading={loading} />
        <PremiumMetricCard label="Routine" value={brief?.green ?? 0} icon={Activity} accent="#22c55e" loading={loading} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.href} href={a.href} className="glass-hover group p-5">
            <p className="font-semibold text-white group-hover:text-accent-glow">{a.label}</p>
            <p className="mt-1 text-xs text-slate-400">{a.desc}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
          <span className="h-2 w-2 rounded-full bg-live live-pulse" />
          Live Triage Queue
        </h2>
        <LiveTriageQueue patients={patients} />
      </div>

      <div className="grid grid-cols-2 gap-6">
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
          <h3 className="font-semibold text-white">Priority Cases — Action Required</h3>
          <div className="mt-4 space-y-2">
            {brief.priority_cases.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/reports/?id=${p.id}`}
                className="live-queue-item"
              >
                <div>
                  <p className="font-medium text-white">{p.name} · {p.age}y</p>
                  <p className="text-xs text-slate-400">{p.symptoms}</p>
                </div>
                <UrgencyBadge urgency={p.urgency} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
