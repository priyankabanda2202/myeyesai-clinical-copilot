"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { Bot, Clock, DollarSign, TrendingUp, Users, Zap } from "lucide-react";
import LiveStatusBar from "@/components/LiveStatusBar";
import PremiumMetricCard from "@/components/PremiumMetricCard";
import { fetchOperations, PracticeOperations } from "@/lib/api";

export default function OperationsPage() {
  const [ops, setOps] = useState<PracticeOperations | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [connected, setConnected] = useState(true);

  function refresh() {
    fetchOperations()
      .then((d) => {
        setOps(d);
        setLastSync(new Date());
        setConnected(true);
      })
      .catch(() => setConnected(false));
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, []);

  const chartData = ops
    ? [
        { name: "Time Saved (hrs)", value: ops.hours_saved_total, fill: "#10b981" },
        { name: "Revenue Pipeline ($K)", value: Math.round(ops.revenue_pipeline_usd / 1000), fill: "#d4a853" },
        { name: "At-Risk Prevented ($K)", value: Math.round(ops.revenue_at_risk_prevented_usd / 1000), fill: "#3b82f6" },
      ]
    : [];

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Practice ROI & Automation Hub</h2>
        <p className="text-sm text-slate-400">
          How VisionFlow reduces staff time, automates eyecare workflows, and protects revenue
        </p>
      </div>

      <LiveStatusBar connected={connected} lastSync={lastSync} onRefresh={refresh} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <PremiumMetricCard
          label="Hours Saved Today"
          value={Math.round(ops?.hours_saved_total ?? 0)}
          icon={Clock}
          accent="#10b981"
        />
        <PremiumMetricCard
          label="Revenue Pipeline"
          value={Math.round((ops?.revenue_pipeline_usd ?? 0) / 1000)}
          icon={DollarSign}
          accent="#d4a853"
        />
        <PremiumMetricCard
          label="Automation Rate"
          value={ops?.automation_rate_percent ?? 0}
          icon={Zap}
          accent="#3b82f6"
        />
        <PremiumMetricCard
          label="Capacity Gain"
          value={ops?.staff_capacity_gain_percent ?? 0}
          icon={TrendingUp}
          accent="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass p-6">
          <h3 className="font-semibold text-white">What We Automate for Your Practice</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {[
              "Patient intake & structured ophthalmology data capture",
              "AI clinical reasoning — no manual differential drafting",
              "Emergency / urgent / routine triage routing",
              "Attending notes & chart documentation",
              "Patient education handouts (print-ready)",
              "ICD-10 capture for faster billing",
              "Auto-scheduling & referral prioritization",
              "Clinical assistant for instant case Q&A",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Bot size={14} className="text-live" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6">
          <h3 className="font-semibold text-white">Revenue Protection</h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
              <p className="text-xs text-gold">Monthly projection</p>
              <p className="text-3xl font-bold text-white">
                ${(ops?.monthly_projection_usd ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">From automated case capture & coding</p>
            </div>
            <div className="rounded-xl border border-critical/20 bg-critical/5 p-4">
              <p className="text-xs text-red-300">High-value cases protected</p>
              <p className="text-2xl font-bold text-white">
                ${(ops?.revenue_at_risk_prevented_usd ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Urgent cases auto-prioritized — fewer missed referrals</p>
            </div>
            <p className="text-xs text-slate-500">
              {ops?.charts_auto_drafted ?? 0} charts auto-drafted · {ops?.physician_reviews_pending ?? 0} pending quick physician sign-off
            </p>
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <h3 className="mb-4 font-semibold text-white">Practice Impact Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#0c1422", border: "1px solid #1a2d4a", borderRadius: 12 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-6">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-live" />
          <h3 className="font-semibold text-white">Staff Efficiency</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Your team currently processes cases in ~{ops?.avg_time_per_case_minutes ?? 7} minutes with VisionFlow
          vs ~45 minutes manually — a {ops?.throughput_gain_percent ?? 38}% throughput gain. That frees technicians
          and front desk staff to see more patients and convert more surgical referrals without hiring.
        </p>
      </div>
    </div>
  );
}
