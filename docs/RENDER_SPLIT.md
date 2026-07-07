# Render: Instant UI + Warm API

## What changed

Your app is now split on Render:

1. **`visionflow-clinical-copilot`** → Static site (HTML/JS/CSS) — **loads instantly** when someone clicks the link
2. **`visionflow-api`** → Python API only — may sleep on free tier; ping with UptimeRobot

## Apply on Render (one time)

1. Go to https://dashboard.render.com
2. Open your **visionflow-clinical-copilot** service
3. Either:
   - **Option A:** Blueprint → connect repo → Sync `render.yaml`, OR
   - **Option B:** Manually:
     - Change existing service to **Static Site** (or create new static site from repo, `build-frontend.sh`, publish `web/out`)
     - Create new **Web Service** named `visionflow-api`, Python, start: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`, build: `pip install -r requirements.txt`
     - Add env `VISIONFLOW_API_ONLY=true` and `GROQ_API_KEY` on API service
     - On static site build, set `NEXT_PUBLIC_API_URL` = `https://visionflow-api.onrender.com`

4. Set **keep warm**: [UPTIME_SETUP.md](UPTIME_SETUP.md) — ping `https://visionflow-api.onrender.com/api/ping` every 5 min

## Result

| Before | After |
|--------|-------|
| Click link → wait 30–60 sec for everything | Click link → **UI appears immediately** |
| Full page blank/spinner | Thin banner while API connects (if cold) |
| With UptimeRobot on old URL | With UptimeRobot on **API URL** → live data in ~1 sec |
