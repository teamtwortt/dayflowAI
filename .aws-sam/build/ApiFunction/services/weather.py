"""OpenWeatherMap integration + advice generation."""
import requests

from config import settings


_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_weather(city: str) -> dict:
    """Fetch current weather for `city`. Returns a safe stub if the API fails."""
    api_key = settings.WEATHER_API_KEY
    if not api_key or api_key.lower() in {"none", "stub", "disabled"}:
        return _stub(city)
    try:
        resp = requests.get(
            _BASE_URL,
            params={"q": city, "appid": settings.WEATHER_API_KEY, "units": "imperial"},
            timeout=5,
        )
        if resp.status_code != 200:
            return _stub(city)
        data = resp.json()
        return {
            "temp": data["main"]["temp"],
            "feels_like": data["main"].get("feels_like"),
            "description": data["weather"][0]["description"],
            "city": data.get("name", city),
            "humidity": data["main"].get("humidity"),
            "wind_speed": data.get("wind", {}).get("speed"),
            "high": data["main"].get("temp_max"),
            "low": data["main"].get("temp_min"),
            "icon": data["weather"][0].get("icon"),
        }
    except (requests.RequestException, KeyError, ValueError):
        return _stub(city)


def _stub(city: str) -> dict:
    return {
        "temp": 68.0,
        "feels_like": 68.0,
        "description": "partly cloudy",
        "city": city,
        "humidity": 50,
        "wind_speed": 5.0,
        "high": 75.0,
        "low": 60.0,
        "icon": None,
    }


def build_advice(weather: dict) -> str:
    desc = (weather.get("description") or "").lower()
    temp = weather.get("temp", 70)
    tips: list[str] = []
    if "rain" in desc or "drizzle" in desc:
        tips.append("Bring an umbrella today.")
    if "snow" in desc:
        tips.append("Heavy snow expected — allow extra commute time.")
    if "storm" in desc or "thunder" in desc:
        tips.append("Severe weather — consider rescheduling outdoor plans.")
    if temp < 32:
        tips.append("Freezing temperatures — bundle up.")
    elif temp < 45:
        tips.append("It's cold — wear a heavy jacket.")
    elif temp < 60:
        tips.append("Chilly outside — grab a light jacket.")
    elif temp > 90:
        tips.append("Hot day — stay hydrated.")
    if not tips:
        tips.append("Weather looks good today!")
    return " ".join(tips)
