# Keep Render API Warm — 2 Minute Setup

UptimeRobot is **free** and pings your API so Render never sleeps.  
I cannot create the account for you — follow these exact steps once (takes ~2 minutes).

## After deploy (split architecture)

| Service | URL | Purpose |
|---------|-----|---------|
| **UI (instant load)** | https://visionflow-clinical-copilot.onrender.com | Static site — opens immediately |
| **API (keep warm)** | https://visionflow-api.onrender.com | Ping this every 5 min |

## UptimeRobot steps

1. Go to **https://uptimerobot.com** → Sign Up (free)
2. Click **+ Add New Monitor**
3. Fill in exactly:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** VisionFlow API
   - **URL:** `https://visionflow-api.onrender.com/api/ping`
   - **Monitoring Interval:** 5 minutes
4. Click **Create Monitor**

Done. The API stays warm 24/7 — no 30–60 second wait when someone opens the app.

## What you get

- **Click main link** → UI loads **instantly** (static hosting)
- **Live data** connects within 1–2 seconds if API is warm (UptimeRobot)
- **Without UptimeRobot** → UI still loads fast; a thin banner shows while API wakes (~30 sec once)

## Alternative: cron-job.org

1. https://cron-job.org → free account
2. Create cron job → every **10 minutes**
3. URL: `https://visionflow-api.onrender.com/api/ping`
4. Method: GET

## Paid option (zero setup)

Render **Starter** plan (~$7/mo) on `visionflow-api` — never sleeps, no ping needed.
