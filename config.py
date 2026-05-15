from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    AWS_REGION: str = "us-east-1"

    COGNITO_USER_POOL_ID: str = ""
    COGNITO_CLIENT_ID: str = ""

    # Local dev defaults; Lambda gets DYNAMO_* from SAM (names must match DynamoDB exactly).
    DYNAMO_EVENTS_TABLE: str = "dayflow-events"
    DYNAMO_USERS_TABLE: str = "dayflow-users"
    DYNAMO_TASKS_TABLE: str = "dayflow-tasks"

    WEATHER_API_KEY: str = ""

    SNS_TOPIC_ARN: str = ""
    SES_FROM_EMAIL: str = "no-reply@dayflowai.example"

    BEDROCK_GUARDRAIL_ID: str = ""
    BEDROCK_GUARDRAIL_VERSION: str = "DRAFT"

    # Prefer Haiku 4.5 — Claude 3 / 3.5 Haiku show as Legacy in Bedrock catalog when inactive.
    BEDROCK_MODEL_ID: str = "anthropic.claude-haiku-4-5-20251001-v1:0"

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
