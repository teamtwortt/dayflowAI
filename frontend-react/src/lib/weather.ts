import type { LucideIcon } from "lucide-react";
import {
  CloudRain,
  CloudSnow,
  Cloud,
  Sun,
  CloudLightning,
  CloudFog,
  Cloudy,
} from "lucide-react";

export function getWeatherIcon(description?: string | null): LucideIcon {
  if (!description) return Cloudy;
  const d = description.toLowerCase();
  if (d.includes("thunder") || d.includes("storm")) return CloudLightning;
  if (d.includes("rain") || d.includes("drizzle")) return CloudRain;
  if (d.includes("snow")) return CloudSnow;
  if (d.includes("fog") || d.includes("mist") || d.includes("haze"))
    return CloudFog;
  if (d.includes("clear") || d.includes("sun")) return Sun;
  if (d.includes("cloud")) return Cloud;
  return Cloudy;
}
