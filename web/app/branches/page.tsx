import { BRANCHES, HOSPITAL } from "@/lib/hospital";
import { Clock, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

export default function BranchesPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Campus Locations</h2>
        <p className="text-sm text-slate-400">
          {HOSPITAL.name} — {BRANCHES.length} active sites across Massachusetts
        </p>
      </div>

      <div className="grid gap-6">
        {BRANCHES.map((branch, i) => (
          <div key={branch.id} className={`glass p-6 ${i === 0 ? "border-live/30" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {i === 0 && (
                  <span className="mb-2 inline-block rounded-full bg-live/10 px-2 py-0.5 text-[10px] font-bold uppercase text-live">
                    Your Active Site
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">{branch.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                  <MapPin size={14} />
                  {branch.address}
                </p>
              </div>
              <span className="rounded-full border border-live/30 bg-live/10 px-3 py-1 text-xs font-semibold text-live">
                {branch.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Phone size={12} /> Phone
                </p>
                <p className="text-slate-300">{branch.phone}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} /> Hours
                </p>
                <p className="text-slate-300">{branch.hours}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <User size={12} /> Site Lead
                </p>
                <p className="text-slate-300">{branch.lead}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Capacity</p>
                <p className="text-slate-300">{branch.beds} treatment bays</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Departments</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {branch.departments.map((d) => (
                  <span
                    key={d}
                    className="rounded-lg border border-border/60 bg-canvas/50 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/live/"
              className="mt-4 inline-block text-sm text-accent-glow hover:underline"
            >
              View live triage queue for this site →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
