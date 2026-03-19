from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./umkm.db"
    SECRET_KEY: str = "changeme-secret-key-please-set-in-env"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-haiku-4-5-20251001"
    OPENAI_API_KEY: str = ""
    MAX_TOKENS: int = 1024

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
