from typing import Any, Dict, Optional

from pydantic import EmailStr, PostgresDsn, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 3000  # 50 minutes
    PROJECT_NAME: str = "FastAPI Starter Template"
    FIREBASE_CONFIG: dict = {}
    FIREBASE_CRED: dict = {}

    POSTGRES_SERVER: str
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "postgres"
    SQLALCHEMY_DATABASE_URI: str | None = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return str(
            PostgresDsn.build(
                scheme="postgresql",
                username=values.get("POSTGRES_USER"),
                password=values.get("POSTGRES_PASSWORD"),
                host=values.get("POSTGRES_SERVER"),
                path=f"{values.get('POSTGRES_DB') or ''}",
            )
        )

    EMAIL_TEST_USER: EmailStr = "test@example.com"  # type: ignore
    FIRST_SUPERUSER_FIRSTNAME: str = "admin"
    FIRST_SUPERUSER_LASTNAME: str = "admin"
    FIRST_SUPERUSER: EmailStr = "admin@email.com"
    FIRST_SUPERUSER_PASSWORD: str = "password"
    USERS_OPEN_REGISTRATION: bool = False

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
