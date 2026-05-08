import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY  = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather(city: str) -> dict:
    resp = requests.get(BASE_URL, params={
        "q":     city,
        "appid": API_KEY,
        "units": "imperial"
    })
    data = resp.json()
    return {
        "temp":        data["main"]["temp"],
        "description": data["weather"][0]["description"],
        "city":        data["name"]
    }

def build_weather_advice(weather: dict) -> str:
    desc  = weather["description"].lower()
    temp  = weather["temp"]
    advice = []
    if "rain" in desc:
        advice.append("Bring an umbrella today.")
    if temp < 40:
        advice.append("It's cold — wear a heavy jacket.")
    elif temp < 55:
        advice.append("Chilly outside — grab a light jacket.")
    return " ".join(advice) if advice else "Weather looks good today!"