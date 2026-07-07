"use client";

import { useState } from "react";
import { submitAttestation } from "@/lib/api";

type Status = "pending" | "accepted" | "modified" | "rejected";

const LABELS: Record<Status, string> = {
  pending: "Pending physician review",
  accepted: "Assessment accepted for chart",
  modified: "Marked for modification",
  rejected: "Assessment rejected — manual review required",
};

export default function AttestationBar({
  patientId,
  initialStatus = "pending",
  initialNote = "",
  reviewedAt = "",
}: {
  patientId?: number;
  initialStatus?: string;
  initialNote?: string;
  reviewedAt?: string;
}) {
  const [status, setStatus] = useState<Status>(
    (initialStatus as Status) || "pending"
  );
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(reviewedAt);
  const [saving, setSaving] = useState(false);

  async function save(next: Status) {
    setStatus(next);
    if (!patientId) return;
    setSaving(true);
    try {
      const res = await submitAttestation(patientId, next, note);
      setSaved(res.reviewed_at || "Saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-canvas/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8cb8]">
        Physician attestation (required for CDS governance)
      </p>
      <p className="mt-1 text-sm text-slate-300">{LABELS[status]}</p>
      {saved && (
        <p className="mt-1 text-[11px] text-live">Last recorded: {saved}</p>
      )}
      <textarea
        className="mt-3 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-white"
        placeholder="Reviewer notes (optional)"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(["accepted", "modified", "rejected"] as const).map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => save(action)}
            disabled={saving}
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition ${
              status === action
                ? "border-live/50 bg-live/10 text-live"
                : "border-border text-slate-400 hover:text-white"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
