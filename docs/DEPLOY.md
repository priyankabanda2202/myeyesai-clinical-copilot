# Deploy Live Demo (Render — like Ticker Research Platform)

## 1. Get a free Groq API key (cloud LLM — Ollama does not run on Render)

1. Go to https://console.groq.com/
2. Sign up → **API Keys** → Create key
3. Copy the key

Groq powers the live demo with `llama-3.1-8b-instant` (fast, free tier).

## 2. Deploy on Render

1. Go to https://dashboard.render.com/
2. **New +** → **Blueprint** (or **Web Service**)
3. Connect GitHub repo: `myeyesai-clinical-copilot` (or `visionflow-clinical-copilot`)
4. Render reads `render.yaml` automatically
5. Add environment variable:
   - `GROQ_API_KEY` = your Groq key
6. Click **Deploy**

Your live URL will be:

**https://visionflow-clinical-copilot.onrender.com**

*(First load may take 30–60s on free tier — Render spins down when idle.)*

## 3. Local development (Ollama)

Keep using Ollama locally — no Groq key needed if Ollama is running:

```powershell
ollama serve
streamlit run frontend/app.py
```

## 4. Portfolio link

After deploy, your portfolio **Live Demo** button points to:

`https://visionflow-clinical-copilot.onrender.com`
