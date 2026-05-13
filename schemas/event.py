"""Event schemas."""
from typing import Literal, Optional
from datetime import datetime

from pydantic import BaseModel, Field


EventCategory = Literal["work", "personal", "general", "health", "social"]


class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    datetime: str
    category: EventCategory = "general"
    notes: Optional[str] = Field(default=None, max_length=1000)
    priority: Optional[Literal["low", "medium", "high"]] = "medium"
    location: Optional[str] = Field(default=None, max_length=200)


class EventUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    datetime: Optional[str] = None
    category: Optional[EventCategory] = None
    notes: Optional[str] = Field(default=None, max_length=1000)
    priority: Optional[Literal["low", "medium", "high"]] = None
    location: Optional[str] = Field(default=None, max_length=200)
    completed: Optional[bool] = None


class Event(BaseModel):
    userId: str
    eventId: str
    title: str
    datetime: str
    category: EventCategory
    notes: Optional[str] = None
    priority: Optional[str] = "medium"
    location: Optional[str] = None
    completed: bool = False
    createdAt: str
    updatedAt: Optional[str] = None
