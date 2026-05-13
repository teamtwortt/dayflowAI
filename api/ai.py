"""AI endpoints (Bedrock-backed, with safe local fallbacks)."""
from datetime import date

from fastapi import APIRouter, Depends

from api.deps import get_current_user
from schemas.ai import (
    AIBriefingResponse,
    AIChatRequest,
    AIChatResponse,
    ParseEventRequest,
    ParsedEvent,
)
from services.bedrock import (
    assistant_reply,
    generate_briefing,
    parse_event_text,
)
from services.dynamo import get_user_prefs, list_events
from services.weather import get_weather

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/parse-event", response_model=ParsedEvent)
def parse_event(
    payload: ParseEventRequest, _user: dict = Depends(get_current_user)
):
    return ParsedEvent(**parse_event_text(payload.text))


@router.get("/briefing", response_model=AIBriefingResponse)
def ai_briefing(user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    prefs = get_user_prefs(user_id)
    events = list_events(user_id)
    today_iso = date.today().isoformat()
    todays = [e for e in events if str(e.get("datetime", "")).startswith(today_iso)]
    weather = get_weather(prefs.get("city", "Washington DC"))
    text = generate_briefing(todays, weather)
    return AIBriefingResponse(text=text)


@router.post("/chat", response_model=AIChatResponse)
def chat(payload: AIChatRequest, user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    prefs = get_user_prefs(user_id)
    events = list_events(user_id)
    weather = get_weather(prefs.get("city", "Washington DC"))
    text = assistant_reply(payload.message, events=events, weather=weather)
    return AIChatResponse(reply=text)
