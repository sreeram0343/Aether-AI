from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class AetherSettings(BaseSettings):
    env: str = "development"
    log_level: str = "INFO"

    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None


    #Gateway Settings
    default_timeout: int = 60
    max_retries: int = 3


    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = AetherSettings()