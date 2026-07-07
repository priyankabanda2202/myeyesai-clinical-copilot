"use client";

export default function PrintReport({ targetId }: { targetId: string }) {
  function handlePrint() {
    const el = document.getElementById(targetId);
    if (!el) {
      window.print();
      return;
    }
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>VisionFlow Clinical Report</title>
      <style>
        body { font-family: Georgia, serif; padding: 2rem; color: #111; line-height: 1.6; }
        h1 { font-size: 1.25rem; border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
        .meta { color: #555; font-size: 0.85rem; margin-bottom: 1.5rem; }
        pre { white-space: pre-wrap; font-family: inherit; }
      </style></head><body>
      <h1>VisionFlow Clinical Report</h1>
      <p class="meta">Clinical decision support output — requires physician verification. Synthetic evaluation data.</p>
      ${el.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="rounded-lg border border-border px-3 py-1.5 text-xs text-slate-400 hover:text-white"
    >
      Print / Export PDF
    </button>
  );
}
