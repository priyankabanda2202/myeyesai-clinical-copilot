"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  Activity,
  ClipboardList,
  Eye,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Radio,
  Shield,
  Stethoscope,
  Sun,
  TrendingUp,
} from "lucide-react";
import { fetchHealth } from "@/lib/api";

const links = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/operations/", label: "Practice ROI", icon: TrendingUp, highlight: true },
  { href: "/live/", label: "Live Triage Board", icon: Radio },
  { href: "/intake/", label: "Patient Intake", icon: Stethoscope },
  { href: "/notes/", label: "Clinical Notes", icon: FileText },
  { href: "/reports/", label: "Reports", icon: Activity },
  { href: "/brief/", label: "Daily Brief", icon: Sun },
  { href: "/assistant/", label: "Clinical Assistant", icon: MessageSquare },
  { href: "/audit/", label: "Audit Trail", icon: ClipboardList },
  { href: "/compliance/", label: "Compliance", icon: Shield },
];

export default function Sidebar() {
  const path = usePathname();
  const [engine, setEngine] = useState("…");
  const [model, setModel] = useState("");

  useEffect(() => {
    fetchHealth()
      .then((h) => {
        setEngine(h.engine.charAt(0).toUpperCase() + h.engine.slice(1));
        setModel(h.model);
      })
      .catch(() => setEngine("Offline"));
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-[272px] flex-col border-r border-border/60 bg-[#060b14]/90 p-5 backdrop-blur-2xl">
      <div className="mb-6 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-blue-700 shadow-lg shadow-accent/30">
            <Eye size={22} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-glow">
              VisionFlow
            </p>
            <h1 className="text-base font-bold text-white">Eye Hospital CDS</h1>
          </div>
        </div>
        <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-live/30 bg-live/10 py-1.5 text-[11px] font-semibold text-live">
          <span className="h-2 w-2 rounded-full bg-live live-pulse" />
          Real-Time Clinical Console
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {links.map(({ href, label, icon: Icon, highlight }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-accent/25 to-accent/5 text-white shadow-inner"
                  : "text-slate-400 hover:bg-panel-hover hover:text-white",
                highlight && !active && "border border-live/20 text-live/90"
              )}
            >
              <Icon
                size={18}
                className={clsx(
                  active ? "text-accent-glow" : highlight ? "text-live" : "text-slate-500 group-hover:text-white"
                )}
              />
              {label}
              {highlight && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-live live-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-border/40 bg-canvas/50 p-3 text-[11px] text-slate-500">
        <p className="font-medium text-slate-400">AI Engine</p>
        <p className="text-white">{engine}</p>
        {model && <p className="mt-1 truncate">{model}</p>}
      </div>
    </aside>
  );
}
