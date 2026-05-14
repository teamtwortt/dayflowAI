import { useMemo } from "react";
import {
  addDays,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
} from "date-fns";
import { motion } from "framer-motion";

import type { DayflowEvent } from "../../api/types";
import { cn } from "../../lib/cn";

interface CalendarWeekProps {
  events: DayflowEvent[];
  anchor: Date;
  onEventClick: (event: DayflowEvent) => void;
  onSlotClick: (when: Date) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am – 8pm

export function CalendarWeek({
  events,
  anchor,
  onEventClick,
  onSlotClick,
}: CalendarWeekProps) {
  const start = startOfWeek(anchor, { weekStartsOn: 1 }); // Monday
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const byDay = useMemo(() => {
    const map: Record<string, DayflowEvent[]> = {};
    for (const e of events) {
      try {
        const key = e.datetime.slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(e);
      } catch {
        // skip
      }
    }
    return map;
  }, [events]);

  return (
    <div className="surface-elevated overflow-hidden rounded-2xl">
      <div className="grid grid-cols-[3rem_repeat(7,minmax(0,1fr))] border-b border-cream-300/60 dark:border-ink-500/40">
        <div />
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className={cn(
              "border-l border-cream-300/60 px-2 py-2 text-center text-xs dark:border-ink-500/40",
              isToday(d) && "bg-flame-500/10",
            )}
          >
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-300 dark:text-ink-200">
              {format(d, "EEE")}
            </div>
            <div
              className={cn(
                "mt-0.5 text-lg font-bold leading-none",
                isToday(d) ? "text-flame-500" : "text-ink-700 dark:text-ink-50",
              )}
            >
              {format(d, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-[3rem_repeat(7,minmax(0,1fr))]">
        <div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="h-14 border-b border-cream-300/40 pr-2 pt-1 text-right text-[0.65rem] text-ink-300 dark:border-ink-500/30 dark:text-ink-200"
            >
              {format(new Date().setHours(h, 0, 0, 0), "h a")}
            </div>
          ))}
        </div>

        {days.map((d) => {
          const dayKey = format(d, "yyyy-MM-dd");
          const dayEvents = byDay[dayKey] ?? [];
          return (
            <div
              key={d.toISOString()}
              className="relative border-l border-cream-300/60 dark:border-ink-500/40"
            >
              {HOURS.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    const slot = new Date(d);
                    slot.setHours(h, 0, 0, 0);
                    onSlotClick(slot);
                  }}
                  className="block h-14 w-full border-b border-cream-300/40 transition-colors hover:bg-flame-500/5 dark:border-ink-500/30"
                  aria-label={`Add event at ${format(d, "EEE")} ${h}:00`}
                />
              ))}

              {dayEvents.map((event) => {
                try {
                  const dt = parseISO(event.datetime);
                  if (!isSameDay(dt, d)) return null;
                  const minutes = dt.getHours() * 60 + dt.getMinutes() - HOURS[0] * 60;
                  if (minutes < 0 || minutes > HOURS.length * 60) return null;
                  const top = (minutes / 60) * 3.5; // 3.5rem per hour
                  return (
                    <motion.button
                      key={event.eventId}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => onEventClick(event)}
                      style={{ top: `${top}rem` }}
                      className={cn(
                        "absolute left-1 right-1 rounded-md border-l-2 border-flame-500 px-2 py-1 text-left text-[0.7rem]",
                        "bg-flame-500/15 text-ink-700 hover:bg-flame-500/25 dark:bg-flame-500/20 dark:text-ink-50",
                        event.completed && "opacity-60",
                      )}
                    >
                      <div
                        className={cn(
                          "truncate font-semibold",
                          event.completed && "line-through",
                        )}
                      >
                        {event.title}
                      </div>
                      <div className="text-[0.6rem] text-flame-700 dark:text-flame-100">
                        {format(dt, "h:mm a")}
                      </div>
                    </motion.button>
                  );
                } catch {
                  return null;
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
