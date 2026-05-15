"""Morning briefing endpoint."""
from datetime import datetime
from decimal import Decimal
from typing import Any
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, Query

from api.deps import get_current_user
from schemas.briefing import Briefing
from services.dynamo import get_user_prefs, list_events
from services.weather import build_advice, get_weather

router = APIRouter(prefix="/briefing", tags=["briefing"])


def _json_safe(obj: Any) -> Any:
    """Convert DynamoDB Decimals so Pydantic response models validate."""
    if isinstance(obj, Decimal):
        integral = obj.to_integral_value()
        return int(integral) if obj == integral else float(obj)
    if isinstance(obj, dict):
        return {k: _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_json_safe(v) for v in obj]
    return obj


def _safe_tz(name: str | None) -> ZoneInfo:
    """IANA tz from prefs (e.g. America/New_York). Lambda runs in UTC; don't use naive local now."""
    if not name or not str(name).strip():
        return ZoneInfo("UTC")
    try:
        return ZoneInfo(str(name).strip())
    except Exception:
        return ZoneInfo("UTC")


def _greeting(now_local: datetime) -> str:
    h = now_local.hour
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

    tz = _safe_tz(prefs.get("timezone"))
    now_local = datetime.now(tz)
    today_iso = now_local.date().isoformat()

    all_events = list_events(user_id)
    todays = [e for e in all_events if str(e.get("datetime", "")).startswith(today_iso)]
    weather = get_weather(resolved_city)
    safe_events = [_json_safe(e) for e in todays]

    return Briefing(
        date=today_iso,
        event_count=len(todays),
        events=safe_events,
        weather=weather,
        advice=build_advice(weather),
        greeting=_greeting(now_local),
        summary=_summary(len(todays), weather),
    )
