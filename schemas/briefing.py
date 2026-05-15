from typing import List

from pydantic import BaseModel

from .event import Event


class Weather(BaseModel):
    temp: float
    feels_like: float | None = None
    description: str
    city: str
    humidity: int | None = None
    wind_speed: float | None = None
    high: float | None = None
    low: float | None = None
    icon: str | None = None


class Briefing(BaseModel):
    date: str
    event_count: int
    events: List[Event]
    weather: Weather
    advice: str
    greeting: str
    summary: str
