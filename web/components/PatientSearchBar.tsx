"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { fetchPatients, Patient } from "@/lib/api";
import UrgencyBadge from "@/components/UrgencyBadge";

export default function PatientSearchBar() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPatients().then(setPatients).catch(() => null);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? patients
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.symptoms?.toLowerCase().includes(q) ||
            p.urgency?.toLowerCase().includes(q)
        )
        .slice(0, 6)
    : [];

  return (
    <div className="relative w-full max-w-xs">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        placeholder="Search patients…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-lg border border-border/60 bg-canvas/60 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500"
      />
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-border bg-panel shadow-xl">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/reports/?id=${p.id}`}
              className="flex items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-panel-hover"
            >
              <span className="truncate text-slate-200">{p.name}</span>
              <UrgencyBadge urgency={p.urgency} compact />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
