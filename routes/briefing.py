from flask import Blueprint, request, jsonify
from middleware.auth_guard import require_auth
from services.dynamo import get_events
from services.weather import get_weather, build_weather_advice
from datetime import date

briefing_bp = Blueprint("briefing", __name__)

@briefing_bp.route("/today", methods=["GET"])
@require_auth
def today_briefing():
    user_id = request.user["sub"]
    city    = request.args.get("city", "Washington DC")
    today   = date.today().isoformat()

    all_events    = get_events(user_id)
    todays_events = [e for e in all_events if e["datetime"].startswith(today)]
    weather       = get_weather(city)

    return jsonify({
        "date":        today,
        "event_count": len(todays_events),
        "events":      todays_events,
        "weather":     weather,
        "advice":      build_weather_advice(weather)
    }), 200