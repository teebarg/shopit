from pydantic_settings import BaseSettings, SettingsConfigDict
import secrets


class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SECRET_KEY: str = secrets.token_urlsafe(32)
    FIREBASE_CRED_PATH: str ="./cred.json"
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
