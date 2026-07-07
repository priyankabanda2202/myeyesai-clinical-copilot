"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ClinicalText from "@/components/ClinicalText";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import LiveStatusBar from "@/components/LiveStatusBar";
import LiveTriageQueue from "@/components/LiveTriageQueue";
import PremiumMetricCard from "@/components/PremiumMetricCard";
import { useLiveData } from "@/hooks/useLiveData";
import { AlertTriangle, Clock, Radio, Users } from "lucide-react";

export default function LiveBoardPage() {
  const { brief, patients, activity, lastSync, connected, loading, refresh } = useLiveData(3000);

  const chartData = [
    { name: "Critical", value: brief?.red ?? 0, fill: "#ef4444" },
    { name: "Urgent", value: brief?.yellow ?? 0, fill: "#f59e0b" },
    { name: "Routine", value: brief?.green ?? 0, fill: "#22c55e" },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-live/30 to-live/5 border border-live/30">
          <Radio size={24} className="text-live" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Live Triage Board</h2>
          <p className="text-sm text-slate-400">
            Hospital-style real-time queue — refreshes every 3 seconds
          </p>
        </div>
      </div>

      <LiveStatusBar connected={connected} lastSync={lastSync} onRefresh={refresh} />

      <div className="grid grid-cols-4 gap-4">
        <PremiumMetricCard label="Waiting" value={brief?.total ?? 0} icon={Users} accent="#3b82f6" loading={loading} />
        <PremiumMetricCard label="Emergency" value={brief?.red ?? 0} icon={AlertTriangle} accent="#ef4444" loading={loading} pulse />
        <PremiumMetricCard label="Urgent" value={brief?.yellow ?? 0} icon={Clock} accent="#f59e0b" loading={loading} />
        <PremiumMetricCard label="Routine" value={brief?.green ?? 0} icon={Users} accent="#22c55e" loading={loading} />
      </div>

      <LiveTriageQueue patients={patients} />

      <div className="grid grid-cols-2 gap-6">
        <div className="brief-card">
          <h3 className="font-semibold text-white">Live Operations Brief</h3>
          <div className="mt-3">
            <ClinicalText text={brief?.narrative} structured={false} />
          </div>
        </div>
        <LiveActivityFeed activity={activity} />
      </div>

      <div className="glass p-6">
        <h3 className="mb-4 font-semibold text-white">Real-Time Volume</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis allowDecimals={false} stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#0c1422", border: "1px solid #1a2d4a", borderRadius: 12 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
