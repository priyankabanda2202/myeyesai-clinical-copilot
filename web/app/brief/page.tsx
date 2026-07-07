"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "@/components/MetricCard";
import { fetchDailyBrief } from "@/lib/api";

export default function BriefPage() {
  const [brief, setBrief] = useState({ total: 0, red: 0, yellow: 0, green: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyBrief()
      .then(setBrief)
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { name: "Critical", value: brief.red },
    { name: "Urgent", value: brief.yellow },
    { name: "Routine", value: brief.green },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Caseload" value={brief.total} loading={loading} />
        <MetricCard label="Critical Today" value={brief.red} loading={loading} />
        <MetricCard label="Urgent Today" value={brief.yellow} loading={loading} />
        <MetricCard label="Routine Today" value={brief.green} loading={loading} />
      </div>

      <div className="glass p-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#111b28", border: "1px solid #1e3048" }} />
              <Bar dataKey="value" fill="#00d4aa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="brief-card">
        <p className="font-semibold text-white">Morning Brief — Clinical Director</p>
        <p className="mt-4 leading-relaxed">
          Critical cases requiring immediate action: <strong>{brief.red}</strong>
          <br />
          Urgent reviews scheduled: <strong>{brief.yellow}</strong>
          <br />
          Routine follow-ups: <strong>{brief.green}</strong>
        </p>
      </div>
    </div>
  );
}
