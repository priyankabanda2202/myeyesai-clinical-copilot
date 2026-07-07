import { PipelineStep } from "@/lib/api";

export default function AgentTrace({ steps }: { steps: PipelineStep[] }) {
  if (!steps?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-canvas/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8cb8]">
        Multi-Agent Pipeline Trace
      </p>
      <p className="mt-1 text-[11px] text-slate-500">
        Transparency log — each agent output for clinical governance review
      </p>
      <div className="mt-4 space-y-3">
        {steps.map((step) => (
          <details key={step.agent} className="rounded-lg border border-border bg-panel/50 px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium text-white">
              <span className="mr-2 text-live">✓</span>
              {step.label}
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-400">
              {step.output_preview || "Complete"}
            </pre>
          </details>
        ))}
      </div>
    </div>
  );
}
