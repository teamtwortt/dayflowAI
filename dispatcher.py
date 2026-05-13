"""Scheduled morning briefing dispatcher.

Designed to run as a standalone Lambda triggered by EventBridge every morning.
Iterates all users in DynamoDB whose preferred briefing time matches the current
window, generates their AI briefing, and dispatches it via SES (email) and/or
SNS (SMS) according to each user's notification preferences.

Can also be invoked locally via `python -m dispatcher` for end-to-end testing.
"""
from __future__ import annotations

import logging
from datetime import datetime, time
from typing import Iterable

import boto3
from boto3.dynamodb.conditions import Attr

from config import settings
from services.bedrock import generate_briefing
from services.dynamo import list_events
from services.notifications import send_email, send_sms
from services.weather import build_advice, get_weather

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dispatcher")


_resource = boto3.resource("dynamodb", region_name=settings.AWS_REGION)
_users_table = _resource.Table(settings.DYNAMO_USERS_TABLE)


def _all_users() -> Iterable[dict]:
    """Yield every user record (paginated scan)."""
    kwargs: dict = {}
    while True:
        resp = _users_table.scan(**kwargs)
        for item in resp.get("Items", []):
            yield item
        if "LastEvaluatedKey" not in resp:
            return
        kwargs["ExclusiveStartKey"] = resp["LastEvaluatedKey"]


def _users_due(now: datetime) -> Iterable[dict]:
    """Yield only users whose preferred briefing time matches the current minute."""
    target = now.strftime("%H:%M")
    return (
        u
        for u in _all_users()
        if (u.get("preferences") or {}).get("briefing_time", "07:00") == target
    )


def build_briefing_payload(user_id: str, prefs: dict) -> dict:
    """Compose a single user's briefing data (events + weather + AI prose)."""
    city = prefs.get("city", "Washington DC")
    today_iso = datetime.now().date().isoformat()
    all_events = list_events(user_id)
    todays = [e for e in all_events if str(e.get("datetime", "")).startswith(today_iso)]
    weather = get_weather(city)
    advice = build_advice(weather)
    text = generate_briefing(todays, weather)
    return {
        "user_id": user_id,
        "events": todays,
        "weather": weather,
        "advice": advice,
        "text": text,
        "city": city,
    }


def _format_email(email: str, payload: dict) -> tuple[str, str, str]:
    subject = f"DayFlow AI — Your morning briefing ({datetime.now():%a, %b %-d})"
    events_html = (
        "".join(
            f'<li style="margin:6px 0;font-size:14px;color:#1a1208">'
            f'<strong style="color:#c87941">{str(e.get("datetime"))[11:16]}</strong> · '
            f'{e.get("title")}'
            "</li>"
            for e in payload["events"]
        )
        or '<li style="color:#7a6652">Nothing on the books today.</li>'
    )
    body_html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;
                background:#f2ede4;padding:24px;color:#1a1208;max-width:560px;margin:0 auto">
      <h2 style="margin:0 0 4px;color:#1a1208">Good morning, {email.split("@")[0]}.</h2>
      <p style="margin:0 0 20px;color:#7a6652;font-size:14px">
        {payload.get("text") or "Here's a quick look at your day."}
      </p>

      <div style="background:#ece4d4;border-radius:14px;padding:16px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;
                    letter-spacing:0.6px;color:#c87941;margin-bottom:8px">Today's plan</div>
        <ul style="list-style:none;padding:0;margin:0">{events_html}</ul>
      </div>

      <div style="background:#ece4d4;border-radius:14px;padding:16px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;
                    letter-spacing:0.6px;color:#c87941;margin-bottom:8px">Weather</div>
        <div style="font-size:14px">
          {round(payload['weather'].get('temp', 0))}°F · {payload['weather'].get('description')} ·
          {payload.get('city')}
        </div>
        <div style="font-size:13px;color:#7a6652;margin-top:4px">{payload['advice']}</div>
      </div>

      <p style="font-size:12px;color:#7a6652;margin-top:24px">
        — DayFlow AI · {datetime.now():%Y}
      </p>
    </div>
    """
    body_text = (
        f"Good morning.\n\n"
        f"{payload.get('text') or ''}\n\n"
        f"Today: "
        + (
            ", ".join(f"{str(e.get('datetime'))[11:16]} {e.get('title')}" for e in payload["events"])
            or "Nothing scheduled"
        )
        + f"\n\nWeather: {round(payload['weather'].get('temp', 0))}°F, "
        f"{payload['weather'].get('description')}. {payload['advice']}\n\n"
        "— DayFlow AI"
    )
    return subject, body_html, body_text


def _format_sms(payload: dict) -> str:
    when = ", ".join(
        f"{str(e.get('datetime'))[11:16]} {e.get('title')}" for e in payload["events"][:3]
    ) or "no events"
    return (
        f"DayFlow AI: {payload['weather'].get('description')}, "
        f"{round(payload['weather'].get('temp', 0))}°F. Today — {when}."
    )


def dispatch_all(now: datetime | None = None) -> dict:
    """Run the dispatch pass. Returns a small summary dict."""
    now = now or datetime.now()
    sent_email = sent_sms = 0
    for user in _users_due(now):
        email = user.get("email")
        prefs = user.get("preferences") or {}
        if not email:
            continue
        payload = build_briefing_payload(user["userId"], prefs)
        if prefs.get("notifications_email", True):
            subject, html, text = _format_email(email, payload)
            if send_email(email, subject, html, text):
                sent_email += 1
        if prefs.get("notifications_sms") and prefs.get("phone"):
            if send_sms(prefs["phone"], _format_sms(payload)):
                sent_sms += 1
    summary = {"sent_email": sent_email, "sent_sms": sent_sms, "at": now.isoformat()}
    logger.info("Dispatch complete: %s", summary)
    return summary


# EventBridge → Lambda entrypoint
def handler(event, context):  # noqa: D401
    """AWS Lambda handler for EventBridge scheduled invocations."""
    _ = event, context  # unused
    summary = dispatch_all()
    return {"statusCode": 200, "body": summary}


if __name__ == "__main__":  # pragma: no cover
    print(dispatch_all())
