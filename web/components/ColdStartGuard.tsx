"use client";

import { useEffect, useState } from "react";
import { fetchHealth } from "@/lib/api";
import { Loader2 } from "lucide-react";

const MAX_ATTEMPTS = 15;
const RETRY_MS = 3000;

export default function ColdStartGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function wake() {
      for (let i = 1; i <= MAX_ATTEMPTS && !cancelled; i++) {
        setAttempt(i);
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

  return (
    <>
      {!ready && (
        <div className="fixed left-0 right-0 top-0 z-[100] border-b border-accent/30 bg-[#0a1628]/95 px-4 py-2.5 backdrop-blur-md md:top-12">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-live" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white">Connecting to clinical systems…</p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-live transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((attempt / MAX_ATTEMPTS) * 100))}%` }}
                />
              </div>
            </div>
            <span className="hidden text-[10px] text-slate-500 sm:inline">UI loaded · API waking up</span>
          </div>
        </div>
      )}
      <div className={!ready ? "pt-12 md:pt-14" : ""}>{children}</div>
    </>
  );
}
