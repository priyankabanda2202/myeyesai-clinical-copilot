"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Sparkles } from "lucide-react";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import LiveStatusBar from "@/components/LiveStatusBar";
import UrgencyBadge from "@/components/UrgencyBadge";
import { askCopilot, fetchPatients, Patient } from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string; streaming?: boolean };

const SUGGESTED_PROMPTS = [
  "What is the most likely diagnosis and why?",
  "What workup would you prioritize first?",
  "What red flags require immediate referral?",
  "How would you counsel this patient?",
];

function typewriter(text: string, onUpdate: (v: string) => void, onDone: () => void) {
  let i = 0;
  const id = setInterval(() => {
    i += 3;
    onUpdate(text.slice(0, i));
    if (i >= text.length) {
      clearInterval(id);
      onDone();
    }
  }, 12);
  return () => clearInterval(id);
}

function AssistantContent() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [connected, setConnected] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPatients()
      .then((data) => {
        setPatients(data);
        setLastSync(new Date());
        const idParam = searchParams.get("id");
        if (idParam) {
          const match = data.find((p) => p.id === Number(idParam));
          if (match) {
            setSelected(match);
            return;
          }
        }
        if (data.length) setSelected(data[0]);
      })
      .catch(() => setConnected(false));
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(question?: string) {
    const text = (question ?? input).trim();
    if (!text || !selected || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setThinking(true);
    try {
      const res = await askCopilot(selected.id, text);
      const full = res.answer;
      setMessages((m) => [...m, { role: "assistant", content: "", streaming: true }]);
      setThinking(false);
      typewriter(
        full,
        (partial) =>
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: partial, streaming: true };
            return copy;
          }),
        () =>
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: full };
            return copy;
          })
      );
      setLastSync(new Date());
    } catch (err: any) {
      setThinking(false);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Unable to reach clinical engine: ${err.message}` },
      ]);
    }
  }

  if (!patients.length) {
    return <div className="glass p-6 text-amber-300">No active cases for consultation.</div>;
  }

  return (
    <div className="animate-fade-up space-y-4">
      <LiveStatusBar connected={connected} lastSync={lastSync} />

      <div className="grid h-[calc(100vh-16rem)] grid-cols-[300px_1fr] gap-5">
        <div className="glass p-5">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Sparkles size={16} className="text-live" />
            Active Case
          </h3>
          <select
            className="field-input mt-3 text-sm"
            value={selected?.id ?? ""}
            onChange={(e) => {
              setSelected(patients.find((p) => p.id === Number(e.target.value)) || null);
              setMessages([]);
            }}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.urgency}
              </option>
            ))}
          </select>
          {selected && (
            <div className="mt-4 space-y-3">
              <Panel title="Case Context">
                <p className="text-sm">Age: {selected.age} · {selected.laterality || "OU"}</p>
                <p className="mt-2 text-sm text-slate-400">{selected.symptoms}</p>
                {selected.visual_acuity && (
                  <p className="mt-1 text-xs text-accent-glow">VA: {selected.visual_acuity}</p>
                )}
              </Panel>
              <UrgencyBadge urgency={selected.urgency} />
            </div>
          )}
        </div>

        <div className="glass flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-accent-glow" />
              <div>
                <h2 className="font-semibold text-white">Real-Time Clinical Assistant</h2>
                <p className="text-[11px] text-live">Live reasoning · streaming response</p>
              </div>
            </div>
            <button
              onClick={() => setMessages([])}
              className="rounded-lg border border-border/60 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-border/40 px-5 py-3">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt)}
                disabled={thinking}
                className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] text-slate-300 transition hover:border-accent/40 hover:text-white disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && (
              <p className="text-sm text-slate-500">Ask a case-specific question — response streams in real time.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-user" : "chat-assistant"}>
                {m.role === "assistant" ? (
                  <div className={m.streaming ? "typing-cursor" : ""}>
                    <ClinicalText text={m.content || "…"} />
                  </div>
                ) : (
                  <span>{m.content}</span>
                )}
              </div>
            ))}
            {thinking && (
              <div className="chat-assistant flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-live live-pulse" />
                <span className="text-slate-400">Clinical reasoning in progress…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2 border-t border-border/50 p-4">
            <input
              className="field-input flex-1"
              placeholder="Ask about this case…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={thinking}
            />
            <button onClick={() => send()} disabled={thinking || !input.trim()} className="btn-primary px-6">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="glass p-6">Loading assistant…</div>}>
      <AssistantContent />
    </Suspense>
  );
}
