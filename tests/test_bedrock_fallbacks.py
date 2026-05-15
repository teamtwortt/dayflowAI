"""Tests for the deterministic Bedrock fallback parsers."""
from datetime import datetime
from unittest.mock import patch

from services.bedrock import _heuristic_parse_event, _heuristic_assistant_reply


def _now():
    return datetime(2026, 5, 13, 8, 0, 0)


def test_heuristic_parse_tomorrow_at_time():
    result = _heuristic_parse_event("Lunch with Maya tomorrow at 1pm", _now())
    assert result["title"].lower().startswith("lunch")
    assert result["datetime"].startswith("2026-05-14T13:00")
    assert result["category"] == "social"


def test_heuristic_parse_work_keywords():
    result = _heuristic_parse_event("Team standup at 9am", _now())
    assert result["category"] == "work"
    assert result["datetime"].endswith("09:00:00")


def test_heuristic_parse_health_keywords():
    result = _heuristic_parse_event("Doctor appointment tomorrow 10:30am", _now())
    assert result["category"] == "health"
    assert "10:30" in result["datetime"]


def test_assistant_next_event():
    events = [{"title": "Standup", "datetime": "2026-05-13T09:00:00", "category": "work"}]
    reply = _heuristic_assistant_reply("what's next?", events, _now())
    assert "Standup" in reply


def test_assistant_empty():
    reply = _heuristic_assistant_reply("what's next?", [], _now())
    assert reply  


def test_assistant_today():
    events = [
        {"title": "Standup", "datetime": "2026-05-13T09:00:00", "category": "work"},
        {"title": "Lunch", "datetime": "2026-05-13T12:30:00", "category": "social"},
    ]
    reply = _heuristic_assistant_reply("what's on today", events, _now())
    assert "2 event" in reply or "Standup" in reply


@patch("services.bedrock._invoke_claude", return_value=None)
def test_parse_event_uses_fallback_when_bedrock_down(_):
    from services.bedrock import parse_event_text

    result = parse_event_text("Coffee with Sam Friday at 3pm", now=_now())
    assert result["title"].lower().startswith("coffee")
    assert "T15:00" in result["datetime"]
