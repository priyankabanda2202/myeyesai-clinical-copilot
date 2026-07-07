"use client";

import { useEffect, useState } from "react";
import { fetchHealth } from "@/lib/api";
import { Loader2 } from "lucide-react";

const MAX_ATTEMPTS = 12;
const RETRY_MS = 5000;

export default function ColdStartGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("Connecting to clinical systems…");

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function wake() {
      for (let i = 1; i <= MAX_ATTEMPTS && !cancelled; i++) {
        setAttempt(i);
        if (i === 1) setMessage("Connecting to clinical systems…");
        else if (i <= 3) setMessage("Starting hospital platform services…");
        else setMessage("Almost ready — servers are coming online…");

        try {
          await fetchHealth();
          if (!cancelled) setReady(true);
          return;
        } catch {
          await new Promise((r) => {
            timer = setTimeout(r, RETRY_MS);
          });
        }
      }
      if (!cancelled) setReady(true);
    }

    wake();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (ready) return <>{children}</>;

  const progress = Math.min(100, Math.round((attempt / MAX_ATTEMPTS) * 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060b14]">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-accent/20 bg-panel/90 p-8 text-center backdrop-blur-xl">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent-glow" />
        <h2 className="mt-4 text-lg font-semibold text-white">VisionFlow Eye Institute</h2>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-live transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-[11px] text-slate-500">
          Secure clinical platform · First load may take up to 60 seconds
        </p>
      </div>
    </div>
  );
}
