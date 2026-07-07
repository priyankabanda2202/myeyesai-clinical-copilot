"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Radio, Stethoscope, FileText, Menu } from "lucide-react";
import { useNav } from "@/lib/navContext";

const tabs = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/live/", label: "Triage", icon: Radio },
  { href: "/intake/", label: "Intake", icon: Stethoscope },
  { href: "/reports/", label: "Reports", icon: FileText },
];

export default function MobileBottomNav() {
  const path = usePathname();
  const { toggle } = useNav();

  return (
    <nav className="vf-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-[#060b14]/98 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex min-w-[4rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium",
                active ? "text-live" : "text-slate-400"
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={toggle}
          className="flex min-w-[4rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium text-slate-400"
          aria-label="Open full menu"
        >
          <Menu size={20} />
          Menu
        </button>
      </div>
    </nav>
  );
}
