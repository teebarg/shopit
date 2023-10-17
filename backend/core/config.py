from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 3000  # 50 minutes
    PROJECT_NAME: str = "FastAPI Starter Template"
    FIREBASE_CONFIG: dict = {}
    FIREBASE_CRED: dict = {}

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
