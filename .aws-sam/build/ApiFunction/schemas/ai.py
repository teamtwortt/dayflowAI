"""AI endpoint schemas."""
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

from .event import EventCategory


class ParseEventRequest(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class ParsedEvent(BaseModel):
    title: str
    datetime: str
    category: EventCategory = "general"
    location: Optional[str] = None
    notes: Optional[str] = None


class AIChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: List[AIChatMessage] = Field(default_factory=list)


class AIChatResponse(BaseModel):
    reply: str


class AIBriefingResponse(BaseModel):
    text: Optional[str] = None
