"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AttestationBar from "@/components/AttestationBar";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchReviewQueue, Patient } from "@/lib/api";

export default function ReviewPage() {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviewQueue()
      .then((data) => {
        setQueue(data);
        if (data.length) setSelected(data[0]);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Physician Review Desk</h2>
        <p className="text-sm text-slate-400">
          Pending attestations sorted by clinical urgency — accept, modify, or reject AI assessments.
        </p>
      </div>

      {error && <div className="glass p-4 text-red-300">{error}</div>}

      {!queue.length && !error && (
        <div className="glass p-8 text-center">
          <p className="text-live font-medium">Review queue clear</p>
          <p className="mt-1 text-sm text-slate-400">All physician attestations are up to date.</p>
        </div>
      )}

      {queue.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="glass p-4">
            <p className="mb-3 text-xs font-bold uppercase text-slate-500">{queue.length} cases awaiting review</p>
            <div className="space-y-2 max-h-[32rem] overflow-y-auto">
              {queue.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p)}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                    selected?.id === p.id
                      ? "border-accent/50 bg-accent/10"
                      : "border-border/50 hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{p.name}</span>
                    <UrgencyBadge urgency={p.urgency} compact />
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">{p.symptoms}</p>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="glass space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <UrgencyBadge urgency={selected.urgency} />
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-slate-400">
                  {selected.laterality || "OU"}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Clinical Assessment</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {selected.diagnosis?.slice(0, 600) || "—"}
                </p>
              </div>
              <AttestationBar
                patientId={selected.id}
                initialStatus={selected.review_status}
                initialNote={selected.reviewer_note}
                reviewedAt={selected.reviewed_at}
              />
              <Link href={`/reports/?id=${selected.id}`} className="text-sm text-accent-glow hover:underline">
                Full report & download →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
