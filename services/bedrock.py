"""Amazon Bedrock integration.

Falls back to deterministic heuristics if Bedrock is unavailable so the
local development experience never breaks.
"""
from __future__ import annotations

import json
import logging
import re
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from config import settings

logger = logging.getLogger(__name__)


_BEDROCK_MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"

try:
    _runtime = boto3.client("bedrock-runtime", region_name=settings.AWS_REGION)
except Exception as exc:  # pragma: no cover
    logger.warning("Bedrock client init failed: %s", exc)
    _runtime = None


def _invoke_claude(system: str, user: str, max_tokens: int = 600) -> Optional[str]:
    """Call Claude on Bedrock. Returns the text body, or None on failure."""
    if _runtime is None:
        return None
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "system": system,
        "messages": [{"role": "user", "content": user}],
    }
    try:
        resp = _runtime.invoke_model(
            modelId=_BEDROCK_MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(body),
        )
        payload = json.loads(resp["body"].read())
        parts = payload.get("content", [])
        if not parts:
            return None
        return "".join(p.get("text", "") for p in parts if p.get("type") == "text").strip()
    except (ClientError, BotoCoreError, ValueError, KeyError) as exc:
        logger.info("Bedrock invocation fell back to heuristic: %s", exc)
        return None


# ---------------------------------------------------------------------------
# 1) Natural-language event parsing
# ---------------------------------------------------------------------------

_EVENT_PARSE_SYSTEM = (
    "You are a strict structured-data extractor for a calendar app. "
    "Given a casual sentence describing an event, respond with ONLY a JSON object "
    "of the form: "
    '{"title": str, "datetime": ISO-8601 local, "category": one of '
    '["work","personal","general","health","social"], "location": str|null, '
    '"notes": str|null}. '
    "Resolve relative dates (today, tomorrow, next Friday) using the current time provided. "
    "If a time is not stated, default to 09:00. No commentary, no markdown — JSON only."
)


def parse_event_text(text: str, *, now: Optional[datetime] = None) -> dict:
    """Parse free-form text into a structured event dict.

    Always returns a dict with at least `title` and `datetime`. Falls back to
    a heuristic parser if Bedrock is unavailable.
    """
    current = now or datetime.now()
    user_prompt = (
        f"Current local datetime: {current.isoformat()}\n"
        f"Input: {text}\n\n"
        "Respond with the JSON only."
    )
    raw = _invoke_claude(_EVENT_PARSE_SYSTEM, user_prompt, max_tokens=400)
    if raw:
        try:
            cleaned = _extract_json(raw)
            data = json.loads(cleaned)
            return _normalize_event(data, current)
        except (ValueError, json.JSONDecodeError) as exc:
            logger.info("Bedrock returned non-JSON, falling back: %s", exc)
    return _heuristic_parse_event(text, current)


def _extract_json(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        # Strip fences like ```json ... ```
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
    return raw


def _normalize_event(data: dict, now: datetime) -> dict:
    title = (data.get("title") or "Untitled event").strip()
    dt = data.get("datetime") or (now + timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%S")
    category = data.get("category") or "general"
    if category not in {"work", "personal", "general", "health", "social"}:
        category = "general"
    return {
        "title": title,
        "datetime": dt,
        "category": category,
        "location": data.get("location"),
        "notes": data.get("notes"),
    }


_DAY_OFFSETS = {
    "today": 0,
    "tonight": 0,
    "tomorrow": 1,
    "monday": None,
    "tuesday": None,
    "wednesday": None,
    "thursday": None,
    "friday": None,
    "saturday": None,
    "sunday": None,
}


def _heuristic_parse_event(text: str, now: datetime) -> dict:
    """A deterministic fallback so the feature still works without Bedrock."""
    lower = text.lower()

    # Resolve day
    offset = 0
    for key, default in _DAY_OFFSETS.items():
        if key in lower:
            if default is not None:
                offset = default
            else:
                target = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].index(key)
                offset = (target - now.weekday()) % 7 or 7
            break

    # Resolve time
    hour, minute = 9, 0
    m = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", lower)
    if m:
        hour = int(m.group(1))
        minute = int(m.group(2) or 0)
        meridiem = m.group(3)
        if meridiem == "pm" and hour < 12:
            hour += 12
        if meridiem == "am" and hour == 12:
            hour = 0

    dt = (now + timedelta(days=offset)).replace(hour=hour, minute=minute, second=0, microsecond=0)

    # Category heuristic
    category = "general"
    if any(w in lower for w in ["meeting", "standup", "call", "review", "1:1", "client"]):
        category = "work"
    elif any(w in lower for w in ["gym", "run", "workout", "doctor", "dentist", "yoga"]):
        category = "health"
    elif any(w in lower for w in ["lunch", "dinner", "drinks", "coffee", "party"]):
        category = "social"
    elif any(w in lower for w in ["home", "groceries", "errand", "kids", "school"]):
        category = "personal"

    # Title: strip the time/day tokens loosely
    title = re.sub(
        r"\b(today|tonight|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|at\s+\d{1,2}(:\d{2})?\s*(am|pm)?)\b",
        "",
        text,
        flags=re.I,
    )
    title = re.sub(r"\s+", " ", title).strip(" ,.-:") or "Untitled event"
    title = title[:1].upper() + title[1:]

    # Location heuristic ("at <place>")
    location = None
    loc_match = re.search(r"\bat\s+([A-Z][\w\s]+)", text)
    if loc_match:
        location = loc_match.group(1).strip()

    return {
        "title": title,
        "datetime": dt.strftime("%Y-%m-%dT%H:%M:%S"),
        "category": category,
        "location": location,
        "notes": None,
    }


# ---------------------------------------------------------------------------
# 2) AI-generated daily briefing
# ---------------------------------------------------------------------------

_BRIEFING_SYSTEM = (
    "You are DayFlow AI's morning briefing writer. "
    "Write a warm but concise 2-3 sentence morning briefing for the user based on their schedule and weather. "
    "Be specific (mention 1-2 events by name, mention the weather impact if relevant). "
    "Never use bullet points. No greetings — just the briefing body."
)


def generate_briefing(
    events: list[dict], weather: dict, *, tone: str = "warm"
) -> Optional[str]:
    if not events and weather.get("description"):
        return None
    summary_events = "; ".join(
        f"{e.get('title')} at {str(e.get('datetime', ''))[11:16] or '?'}" for e in events[:5]
    ) or "no events"
    user = (
        f"Tone: {tone}\n"
        f"Events today: {summary_events}\n"
        f"Weather: {weather.get('description')}, "
        f"{round(weather.get('temp', 70))}°F in {weather.get('city', 'your area')}.\n"
        f"Write the briefing."
    )
    return _invoke_claude(_BRIEFING_SYSTEM, user, max_tokens=250)


# ---------------------------------------------------------------------------
# 3) Assistant chat
# ---------------------------------------------------------------------------

_ASSISTANT_SYSTEM = (
    "You are DayFlow AI, a calm, helpful productivity assistant. "
    "Reply in 1-4 short sentences. Be specific. "
    "When the user asks 'what should I do now?', recommend the next event by name "
    "and the time. When the user asks about their week, summarize event counts by day. "
    "Never invent events that aren't in the provided context."
)


def assistant_reply(
    question: str,
    *,
    events: list[dict],
    weather: dict,
    now: Optional[datetime] = None,
) -> str:
    current = now or datetime.now()
    summary = "\n".join(
        f"- {e.get('title')} ({e.get('datetime')}) [{e.get('category')}]"
        for e in events[:25]
    ) or "(no upcoming events)"
    user = (
        f"Current local time: {current.isoformat()}\n"
        f"User's events:\n{summary}\n\n"
        f"Weather: {weather.get('description', 'unknown')}, "
        f"{round(weather.get('temp', 70))}°F.\n\n"
        f"User: {question}"
    )
    text = _invoke_claude(_ASSISTANT_SYSTEM, user, max_tokens=400)
    if text:
        return text
    return _heuristic_assistant_reply(question, events, current)


def _heuristic_assistant_reply(
    question: str, events: List[dict], now: datetime
) -> str:
    q = question.lower()
    upcoming = [
        e
        for e in events
        if _safe_parse(e.get("datetime", "")) and _safe_parse(e["datetime"]) >= now
    ]
    upcoming.sort(key=lambda e: e["datetime"])

    if any(k in q for k in ["next", "now", "what should i", "current"]):
        if not upcoming:
            return "Your schedule is clear — a great window for focused work or a break."
        nxt = upcoming[0]
        return f"Your next event is “{nxt.get('title')}” at {str(nxt.get('datetime'))[11:16]}."

    if "today" in q:
        today_iso = now.date().isoformat()
        todays = [e for e in events if str(e.get("datetime", "")).startswith(today_iso)]
        if not todays:
            return "Nothing on the calendar for today."
        return f"You have {len(todays)} event{'s' if len(todays) != 1 else ''} today, starting with “{todays[0].get('title')}”."

    if "week" in q or "this week" in q:
        return f"You have {len(events)} upcoming events on the books — open the Plan view for the full week."

    if not upcoming:
        return "Your calendar is empty — want me to suggest a focus block?"
    return f"Your next event is “{upcoming[0].get('title')}” at {str(upcoming[0].get('datetime'))[11:16]}."


def _safe_parse(value: str) -> Optional[datetime]:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        try:
            return datetime.strptime(value[:19], "%Y-%m-%dT%H:%M:%S")
        except Exception:  # pragma: no cover
            return None


__all__ = [
    "assistant_reply",
    "generate_briefing",
    "parse_event_text",
]


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)
