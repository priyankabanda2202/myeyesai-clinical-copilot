"use client";

import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function LiveStatusBar({
  connected,
  lastSync,
  onRefresh,
}: {
  connected: boolean;
  lastSync: Date | null;
  onRefresh?: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-panel/40 px-4 py-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {connected ? (
          <span className="flex items-center gap-2 text-xs font-medium text-live">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            <Wifi size={14} />
            Real-time sync active
          </span>
        ) : (
          <span className="flex items-center gap-2 text-xs text-red-400">
            <WifiOff size={14} />
            Connection lost — retrying…
          </span>
        )}
        {lastSync && (
          <span className="text-[11px] text-slate-500">
            Last update: {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-live/20 bg-live/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-live">
          Live Hospital Mode
        </span>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-border/60 p-1.5 text-slate-400 transition hover:text-white"
            title="Refresh now"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
