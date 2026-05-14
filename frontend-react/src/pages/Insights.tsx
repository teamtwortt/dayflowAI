import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  addDays,
  format,
  isThisWeek,
  isToday,
  parseISO,
  startOfWeek,
} from "date-fns";
import { CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react";

import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { useEvents } from "../hooks/useEvents";
import { cn } from "../lib/cn";
import type { DayflowEvent } from "../api/types";

export default function Insights() {
  const events = useEvents();

  const stats = useMemo(() => computeStats(events.data ?? []), [events.data]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
        <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
          A quiet look at how this week is taking shape.
        </p>
      </motion.div>

      {events.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Events this week"
              value={stats.weekCount}
              Icon={TrendingUp}
            />
            <StatCard
              label="Completed"
              value={stats.completedThisWeek}
              Icon={CheckCircle2}
            />
            <StatCard
              label="Completion rate"
              value={`${Math.round(stats.completionRate * 100)}%`}
              Icon={Sparkles}
              accent
            />
            <StatCard
              label="Busiest day"
              value={stats.busiestDay}
              Icon={Clock}
            />
          </div>

          <Card className="mt-5">
            <h3 className="text-sm font-semibold">By day</h3>
            <p className="text-xs text-ink-300 dark:text-ink-200">
              Events per day for this week.
            </p>
            <div className="mt-4 grid grid-cols-7 items-end gap-2">
              {stats.weekHistogram.map((cell) => {
                const heightPct = stats.maxPerDay
                  ? (cell.count / stats.maxPerDay) * 100
                  : 0;
                return (
                  <div key={cell.day} className="flex flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end">
                      <div
                        className={cn(
                          "w-full rounded-md transition-all",
                          cell.isToday
                            ? "bg-flame-500"
                            : "bg-flame-500/30",
                        )}
                        style={{ height: `${Math.max(heightPct, 6)}%` }}
                      />
                    </div>
                    <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-300 dark:text-ink-200">
                      {cell.day}
                    </div>
                    <div className="text-xs font-semibold">{cell.count}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="mt-5">
            <h3 className="text-sm font-semibold">By category</h3>
            <div className="mt-4 space-y-3">
              {stats.categoryBreakdown.length === 0 ? (
                <p className="text-sm text-ink-300 dark:text-ink-200">
                  Add some events to see your category mix.
                </p>
              ) : (
                stats.categoryBreakdown.map((row) => (
                  <div key={row.category}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium capitalize">{row.category}</span>
                      <span className="text-ink-300 dark:text-ink-200">
                        {row.count} ({Math.round(row.share * 100)}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream-300 dark:bg-ink-500/40">
                      <div
                        className="h-full rounded-full bg-flame-500"
                        style={{ width: `${row.share * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  Icon: typeof TrendingUp;
  accent?: boolean;
}

function StatCard({ label, value, Icon, accent }: StatCardProps) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-flame-500">
          {label}
        </div>
        <div
          className={cn(
            "mt-1.5 text-2xl font-bold",
            accent && "text-flame-500",
          )}
        >
          {value}
        </div>
      </div>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          accent
            ? "bg-flame-500 text-white"
            : "bg-flame-500/15 text-flame-500",
        )}
      >
        <Icon size={16} />
      </div>
    </Card>
  );
}

function computeStats(all: DayflowEvent[]) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const week = all.filter((e) => {
    try {
      return isThisWeek(parseISO(e.datetime), { weekStartsOn: 1 });
    } catch {
      return false;
    }
  });

  const weekHistogram = days.map((d) => {
    const key = format(d, "yyyy-MM-dd");
    const count = week.filter((e) => e.datetime.startsWith(key)).length;
    return {
      day: format(d, "EEE"),
      count,
      isToday: isToday(d),
    };
  });
  const maxPerDay = Math.max(0, ...weekHistogram.map((d) => d.count));
  const busiestCell = [...weekHistogram].sort((a, b) => b.count - a.count)[0];

  const completedThisWeek = week.filter((e) => e.completed).length;
  const completionRate = week.length ? completedThisWeek / week.length : 0;

  const categoryCounts: Record<string, number> = {};
  for (const e of all) categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  const total = Object.values(categoryCounts).reduce((s, n) => s + n, 0);
  const categoryBreakdown = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      share: total ? count / total : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    weekCount: week.length,
    completedThisWeek,
    completionRate,
    busiestDay: busiestCell?.count ? busiestCell.day : "—",
    weekHistogram,
    maxPerDay,
    categoryBreakdown,
  };
}
