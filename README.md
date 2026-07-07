# VisionFlow Clinical Copilot

Real-time **ophthalmology clinical intelligence platform** — Next.js 15 frontend + FastAPI backend + LangGraph multi-agent pipeline.

> Fictional product name for portfolio demo. No affiliation with any commercial client.

## Stack

| Layer | Tech |
|-------|------|
| **Frontend (main)** | Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts |
| **Backend** | FastAPI, REST APIs |
| **AI** | LangGraph, Groq (cloud) / Ollama (local) |
| **Legacy UI** | Streamlit (`frontend/`) — local fallback only |

## Live Demo (public)

**https://visionflow-clinical-copilot.onrender.com**

Deployed as FastAPI + Next.js static export (single service on Render).

## Run locally (Windows)

### Step 1 — API (project root)

Double-click **`start-api.bat`** or:

```cmd
cd C:\Users\admin\Downloads\myeyesai-clinical-copilot
start-api.bat
```

### Step 2 — UI (project root OR web folder)

Double-click **`start-web.bat`** or from `web` folder run **`start.bat`**:

```cmd
cd C:\Users\admin\Downloads\myeyesai-clinical-copilot
start-web.bat
```

Open **http://localhost:3000**

> Both must run at the same time. The UI proxies API calls to port 8000 automatically.

## Deploy to Render

1. Push to GitHub
2. Render reads `render.yaml` — builds Next.js + starts FastAPI
3. Set `GROQ_API_KEY` in Render environment variables

See `docs/DEPLOY.md`

## Author

Priyanka Banda — GenAI Architect
