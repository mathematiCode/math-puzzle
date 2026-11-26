"""Application configuration.

Settings are loaded from environment variables (and an optional local `.env`
file) via pydantic-settings, so nothing secret or environment-specific is
hard-coded. See `.env.example` for the available knobs.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Frectangles API"
    # "development" | "production"
    environment: str = "development"
    # Comma-separated list of origins allowed to call the API via CORS.
    cors_origins: str = "http://localhost:3000,https://frectangles.com"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (read once per process)."""
    return Settings()
