import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
_client = None


def _reload_env():
    load_dotenv(_ENV_PATH, override=True)


def get_model():
    _reload_env()
    return os.getenv("OLLAMA_MODEL", "llama3:latest")


def get_client():
    global _client
    _reload_env()
    if _client is None:
        _client = OpenAI(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1"),
            api_key="ollama",
        )
    return _client


def chat(prompt: str) -> str:
    client = get_client()
    response = client.chat.completions.create(
        model=get_model(),
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
