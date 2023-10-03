import secrets

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    PROJECT_NAME: str = "FastAPI Ecommerce"
    FIREBASE_CONFIG: dict = {}
    FIREBASE_CRED: dict = {}

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
