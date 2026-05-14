import { motion } from "framer-motion";

import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { getWeatherIcon } from "../../lib/weather";
import type { Weather } from "../../api/types";

interface WeatherCardProps {
  weather: Weather | undefined;
  advice?: string;
  loading: boolean;
}

export function WeatherCard({ weather, advice, loading }: WeatherCardProps) {
  if (loading || !weather) {
    return (
      <Card className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </Card>
    );
  }

  const Icon = getWeatherIcon(weather.description);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={26} className="text-flame-500" />
          <div>
            <div className="text-2xl font-bold leading-none">
              {Math.round(weather.temp)}°F
            </div>
            <div className="mt-1 text-sm capitalize text-ink-300 dark:text-ink-200">
              {weather.description} · {weather.city}
            </div>
            {weather.high != null && weather.low != null ? (
              <div className="mt-0.5 text-[0.7rem] text-ink-300 dark:text-ink-200">
                H: {Math.round(weather.high)}° · L: {Math.round(weather.low)}°
              </div>
            ) : null}
            {advice ? (
              <div className="mt-1.5 text-sm font-medium text-flame-500">
                {advice}
              </div>
            ) : null}
          </div>
        </div>
        <Icon size={44} className="text-flame-500/40" />
      </Card>
    </motion.div>
  );
}
