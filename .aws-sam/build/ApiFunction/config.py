from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    AWS_REGION: str = "us-east-1"

    COGNITO_USER_POOL_ID: str = ""
    COGNITO_CLIENT_ID: str = ""

    DYNAMO_EVENTS_TABLE: str = "dayflow-events"
    DYNAMO_USERS_TABLE: str = "dayflow-users"

    WEATHER_API_KEY: str = ""

    SNS_TOPIC_ARN: str = ""
    SES_FROM_EMAIL: str = "no-reply@dayflowai.example"

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
