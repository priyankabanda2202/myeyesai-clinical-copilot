"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "@/components/MetricCard";
import { fetchDailyBrief } from "@/lib/api";

export default function DashboardPage() {
  const [brief, setBrief] = useState({ total: 0, red: 0, yellow: 0, green: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDailyBrief()
      .then(setBrief)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { name: "Critical", value: brief.red },
    { name: "Urgent", value: brief.yellow },
    { name: "Routine", value: brief.green },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error} — run <code className="text-red-200">start-api.bat</code> from project root, then refresh.
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Active Caseload" value={brief.total} loading={loading} />
        <MetricCard label="Critical" value={brief.red} delta="Immediate" loading={loading} />
        <MetricCard label="Urgent" value={brief.yellow} loading={loading} />
        <MetricCard label="Routine" value={brief.green} loading={loading} />
      </div>

      <div className="glass p-6">
        <h3 className="mb-4 text-lg font-medium text-white">Triage Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#111b28", border: "1px solid #1e3048" }} />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
