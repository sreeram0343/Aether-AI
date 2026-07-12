from __future__ import annotations

from pydantic import BaseModel, Field


class PlatformSettings(BaseModel):
    """Centralized application settings for the Aether platform."""

    provider: str = "openai"
    api_base_url: str = "https://api.openai.com/v1"
    timeout_seconds: int = Field(default=30, ge=1)
    log_level: str = "INFO"
