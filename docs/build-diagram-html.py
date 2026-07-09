from pathlib import Path

docs = Path(__file__).parent
svg_path = docs / "visionflow-flow-diagram.svg"
html_path = docs / "visionflow-flow-diagram.html"

svg_text = svg_path.read_text(encoding="utf-8", errors="replace")
for bad, rep in [("\u2014", " - "), ("\u2013", " - "), ("\u2192", " -> "), ("\x14", " - ")]:
    svg_text = svg_text.replace(bad, rep)

svg_path.write_text(svg_text, encoding="utf-8")

# Strip XML declaration for inline embedding
inline_svg = svg_text
if inline_svg.startswith("<?xml"):
    inline_svg = inline_svg.split(">", 1)[1].lstrip()
inline_svg = inline_svg.replace("<svg xmlns", '<svg id="flow-diagram" xmlns', 1)

html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VisionFlow - System Flow Diagram</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Segoe UI", Inter, Arial, sans-serif; background: #060b14; color: #e2e8f0; min-height: 100vh; }
    .toolbar {
      position: sticky; top: 0; z-index: 100; display: flex; align-items: center;
      justify-content: space-between; gap: 12px; padding: 14px 24px;
      background: rgba(10, 15, 26, 0.95); border-bottom: 1px solid #1a2d4a; flex-wrap: wrap;
    }
    .toolbar h1 { font-size: 1.1rem; color: #fff; }
    .toolbar p { font-size: 0.8rem; color: #64748b; margin-top: 2px; }
    .btns { display: flex; gap: 10px; flex-wrap: wrap; }
    button { display: inline-flex; align-items: center; padding: 10px 18px; border-radius: 10px;
      font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; }
    .btn-gold { background: linear-gradient(90deg, #d4a853, #f0c96a); color: #1a1a1a; }
    .btn-blue { background: #1e40af; color: #fff; border: 1px solid #3b82f6; }
    .btn-ghost { background: transparent; color: #94a3b8; border: 1px solid #1a2d4a; }
    .wrap { max-width: 1440px; margin: 0 auto; padding: 24px; }
    .diagram-frame {
      background: #0a0f1a; border: 1px solid #1a2d4a; border-radius: 16px;
      overflow: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    #flow-diagram { display: block; width: 100%; min-width: 900px; height: auto; }
    .hint { margin-top: 16px; padding: 14px 18px; background: #0c1422; border: 1px solid #1a2d4a;
      border-radius: 12px; font-size: 0.85rem; color: #64748b; line-height: 1.6; }
    .hint strong { color: #d4a853; }
    @media print { .toolbar, .hint { display: none; } .wrap { padding: 0; max-width: none; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <h1>VisionFlow Clinical Copilot - System Flow Diagram</h1>
      <p>End-to-end architecture | All agents | Inputs and outputs | 15 screens</p>
    </div>
    <div class="btns">
      <button class="btn btn-gold" onclick="downloadSVG()">Download SVG</button>
      <button class="btn btn-blue" onclick="downloadPNG()">Download PNG</button>
      <button class="btn btn-ghost" onclick="window.print()">Print / Save PDF</button>
    </div>
  </div>
  <div class="wrap">
    <div class="diagram-frame">
__SVG__
    </div>
    <div class="hint">
      <strong>How to view:</strong> Double-click this file in File Explorer. Scroll inside the diagram to see all 5 phases.
      Use <strong>Download PNG</strong> for slides or <strong>Print / Save PDF</strong> to export.
    </div>
  </div>
  <script>
    function getSvg() { return document.getElementById("flow-diagram"); }
    function downloadSVG() {
      var svg = getSvg();
      var text = new XMLSerializer().serializeToString(svg);
      if (!text.startsWith("<?xml")) text = '<?xml version="1.0" encoding="UTF-8"?>\\n' + text;
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
      a.download = "visionflow-flow-diagram.svg";
      a.click();
    }
    function downloadPNG() {
      var svg = getSvg();
      var text = new XMLSerializer().serializeToString(svg);
      var url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas");
        c.width = 1400 * 2; c.height = 2800 * 2;
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#060b14";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        var a = document.createElement("a");
        a.href = c.toDataURL("image/png");
        a.download = "visionflow-flow-diagram.png";
        a.click();
      };
      img.src = url;
    }
  </script>
</body>
</html>
"""

html_path.write_text(html.replace("__SVG__", inline_svg), encoding="utf-8")
print("Done:", html_path)
