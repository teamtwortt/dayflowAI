"""Morning briefing endpoint."""
from datetime import date, datetime

from fastapi import APIRouter, Depends, Query

from api.deps import get_current_user
from schemas.briefing import Briefing
from services.dynamo import get_user_prefs, list_events
from services.weather import build_advice, get_weather

router = APIRouter(prefix="/briefing", tags=["briefing"])


def _greeting() -> str:
    h = datetime.now().hour
    if h < 12:
        return "Good morning"
    if h < 17:
        return "Good afternoon"
    return "Good evening"


def _summary(event_count: int, weather: dict) -> str:
    if event_count == 0:
        base = "Your day is wide open."
    elif event_count == 1:
        base = "You have one event today."
    elif event_count <= 3:
        base = f"You have {event_count} events scheduled."
    else:
        base = f"A busy day — {event_count} events planned."
    desc = (weather.get("description") or "").lower()
    if "rain" in desc:
        base += " Expect rain."
    elif "snow" in desc:
        base += " Snow in the forecast."
    elif "clear" in desc or "sun" in desc:
        base += " Clear skies ahead."
    return base


@router.get("/today", response_model=Briefing)
def today_briefing(
    user: dict = Depends(get_current_user),
    city: str | None = Query(default=None),
):
    user_id = user["sub"]
    prefs = get_user_prefs(user_id)
    resolved_city = city or prefs.get("city", "Washington DC")

    today_iso = date.today().isoformat()
    all_events = list_events(user_id)
    todays = [e for e in all_events if str(e.get("datetime", "")).startswith(today_iso)]
    weather = get_weather(resolved_city)

    return Briefing(
        date=today_iso,
        event_count=len(todays),
        events=todays,
        weather=weather,
        advice=build_advice(weather),
        greeting=_greeting(),
        summary=_summary(len(todays), weather),
    )
