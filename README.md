# MyEyesAI Clinical Copilot

Streamlit demo for ophthalmology clinical workflows.

## Run locally

```bash
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run frontend/app.py
```

## Deploy (24/7 public link)

1. Push this repo to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. New app → select repo → Main file: `frontend/app.py`
4. Deploy → share the `*.streamlit.app` URL

Set secrets (optional): `LLM_MODE=mock` for free demo mode.
