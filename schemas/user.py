"""User preference schemas."""
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserPreferences(BaseModel):
    city: str = Field(default="Washington DC", max_length=100)
    timezone: str = Field(default="America/New_York")
    notifications_email: bool = True
    notifications_sms: bool = False
    phone: Optional[str] = Field(default=None, max_length=20)
    briefing_time: str = Field(default="07:00")  # 24h HH:MM


class UserProfile(BaseModel):
    sub: str
    email: EmailStr
    name: Optional[str] = None
    preferences: UserPreferences


class UpdatePreferencesRequest(BaseModel):
    city: Optional[str] = None
    timezone: Optional[str] = None
    notifications_email: Optional[bool] = None
    notifications_sms: Optional[bool] = None
    phone: Optional[str] = None
    briefing_time: Optional[str] = None
