import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
_client = None


def _reload_env():
    load_dotenv(_ENV_PATH, override=True)


def get_provider():
    _reload_env()
    if os.getenv("GROQ_API_KEY"):
        return "groq"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    return "ollama"


def get_model():
    _reload_env()
    provider = get_provider()
    if provider == "groq":
        return os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    if provider == "openai":
        return os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    return os.getenv("OLLAMA_MODEL", "llama3:latest")


def get_client():
    global _client
    _reload_env()
    if _client is None:
        provider = get_provider()
        if provider == "groq":
            _client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=os.getenv("GROQ_API_KEY"),
            )
        elif provider == "openai":
            _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        else:
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
