import { Star } from "lucide-react";
import { motion } from "framer-motion";

import { ProgressRing } from "../ui/ProgressRing";
import { Skeleton } from "../ui/Skeleton";
import type { DayflowEvent } from "../../api/types";

interface FocusCardProps {
  events: DayflowEvent[] | undefined;
  loading: boolean;
}

export function FocusCard({ events, loading }: FocusCardProps) {
  const today = new Date().toISOString().slice(0, 10);
  const todays = (events ?? []).filter((e) => e.datetime.startsWith(today));
  const focus = todays[0] ?? (events ?? [])[0];
  const completedToday = todays.filter((e) => e.completed).length;
  const progress = todays.length ? completedToday / todays.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mb-5 flex items-center justify-between rounded-2xl bg-ink-600 px-5 py-4 text-ink-50 shadow-soft"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500/30">
          <Star size={18} className="text-flame-100" aria-hidden />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-flame-100">
            Today's focus
          </div>
          {loading ? (
            <Skeleton className="mt-1 h-4 w-40 bg-ink-500/60" />
          ) : (
            <div className="mt-0.5 text-base font-semibold text-ink-50">
              {focus ? focus.title : "Nothing scheduled"}
            </div>
          )}
          <div className="mt-0.5 text-sm text-ink-100">
            {todays.length} {todays.length === 1 ? "event" : "events"} today
          </div>
        </div>
      </div>

      <ProgressRing
        value={progress}
        label={`${completedToday}/${Math.max(todays.length, 0)}`}
        labelClassName="text-ink-50"
      />
    </motion.div>
  );
}
