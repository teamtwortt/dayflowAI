import { useMemo } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { DayflowEvent } from "../../api/types";
import { cn } from "../../lib/cn";

interface CalendarMonthProps {
  events: DayflowEvent[];
  anchor: Date;
  onEventClick: (event: DayflowEvent) => void;
  onDayClick: (date: Date) => void;
}

export function CalendarMonth({
  events,
  anchor,
  onEventClick,
  onDayClick,
}: CalendarMonthProps) {
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const byDay = useMemo(() => {
    const map: Record<string, DayflowEvent[]> = {};
    for (const e of events) {
      const key = e.datetime.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
    return map;
  }, [events]);

  return (
    <div className="surface-elevated overflow-hidden rounded-2xl">
      <div className="grid grid-cols-7 border-b border-cream-300/60 dark:border-ink-500/40">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-ink-300 dark:text-ink-200"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((d) => {
          const inMonth = isSameMonth(d, anchor);
          const dayKey = format(d, "yyyy-MM-dd");
          const dayEvents = byDay[dayKey] ?? [];
          return (
            <button
              key={d.toISOString()}
              onClick={() => onDayClick(d)}
              className={cn(
                "group flex min-h-[5.5rem] flex-col gap-1 border-b border-l border-cream-300/40 p-1.5 text-left transition-colors dark:border-ink-500/30",
                !inMonth && "opacity-50",
                isToday(d) && "bg-flame-500/5",
                "hover:bg-flame-500/10",
              )}
            >
              <div
                className={cn(
                  "text-xs font-semibold",
                  isToday(d)
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-flame-500 text-white"
                    : "text-ink-700 dark:text-ink-50",
                )}
              >
                {format(d, "d")}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => {
                  try {
                    const time = format(parseISO(event.datetime), "h:mm");
                    return (
                      <div
                        key={event.eventId}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            onEventClick(event);
                          }
                        }}
                        className={cn(
                          "truncate rounded-sm border-l-2 border-flame-500 bg-flame-500/15 px-1 text-[0.65rem]",
                          event.completed && "line-through opacity-60",
                        )}
                      >
                        <span className="font-semibold text-flame-700 dark:text-flame-100">
                          {time}
                        </span>{" "}
                        {event.title}
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })}
                {dayEvents.length > 3 ? (
                  <div className="text-[0.6rem] text-ink-300 dark:text-ink-200">
                    +{dayEvents.length - 3} more
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
