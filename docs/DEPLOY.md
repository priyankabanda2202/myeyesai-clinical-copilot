# Deploy Live Demo (Render)

> **Site still shows Streamlit?** Follow **[docs/RENDER_FIX.md](RENDER_FIX.md)** — update Render start command manually.

## Quick Render settings

| Setting | Value |
|---------|-------|
| Repo | `priyankabanda2202/visionflow-clinical-copilot` |
| Build | `bash build.sh` |
| Start | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |
| Env | `GROQ_API_KEY` (required for cloud LLM) |

Live URL: **https://visionflow-clinical-copilot.onrender.com** (static UI — instant load)

API URL: **https://visionflow-api.onrender.com** (ping this to keep warm)

## Architecture (instant UI)

| Service | Type | URL |
|---------|------|-----|
| `visionflow-clinical-copilot` | **Static site** | Main link — UI loads immediately |
| `visionflow-api` | **Web service** | Backend API only |

After pushing `render.yaml`, open Render Dashboard → **Blueprint** → sync, or manually add the static site + API service.

**Keep API warm (free, 2 min):** See **[docs/UPTIME_SETUP.md](UPTIME_SETUP.md)**

## Render cold start (free tier API only)

The **UI no longer cold-starts** — only the API can sleep. UptimeRobot ping:

```
https://visionflow-api.onrender.com/api/ping
```

Every **5 minutes**.

**Paid fix:** Render Starter (~$7/mo) on `visionflow-api` — no sleep.

## Local development

See [README.md](../README.md)
