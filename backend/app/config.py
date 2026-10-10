from pydantic import BaseModel, Field
import os
import json
from typing import List, Optional

# Load .env file if present in backend directory or root
def _load_env():
    for env_path in [
        os.path.join(os.path.dirname(__file__), "..", ".env"),
        os.path.join(os.path.dirname(__file__), "..", "..", ".env")
    ]:
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            except Exception:
                pass

_load_env()

def _parse_cors_origins() -> List[str]:
    raw = os.getenv("CORS_ORIGINS", "")
    if not raw:
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001"
        ]
    try:
        if raw.startswith("["):
            return json.loads(raw)
        return [origin.strip() for origin in raw.split(",") if origin.strip()]
    except Exception:
        return ["http://localhost:3000", "http://127.0.0.1:3000"]

class Settings(BaseModel):
    APP_NAME: str = "ELEVΛLTE API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    HOST: str = os.getenv("BACKEND_HOST", "127.0.0.1")
    PORT: int = int(os.getenv("BACKEND_PORT", 8000))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "elevalte_super_secret_jwt_key_hackathon_demo")
    CORS_ORIGINS: List[str] = Field(default_factory=_parse_cors_origins)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", None)
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL", None)
    SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    MODE: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()
