import {
  Briefcase,
  Calendar,
  Check,
  Heart,
  Home,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import type { DayflowEvent, EventCategory } from "../../api/types";
import { formatTime } from "../../lib/format";
import { cn } from "../../lib/cn";

const categoryIcon: Record<EventCategory, typeof Calendar> = {
  work: Briefcase,
  personal: Home,
  general: Calendar,
  health: Heart,
  social: Users,
};

interface EventRowProps {
  event: DayflowEvent;
  onToggle: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

export function EventRow({ event, onToggle, onDelete, onClick }: EventRowProps) {
  const Icon = categoryIcon[event.category] ?? Calendar;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex items-center gap-3 border-b border-cream-300/60 py-3 last:border-b-0 dark:border-ink-500/40",
        onClick && "cursor-pointer rounded-lg -mx-1 px-1 hover:bg-cream-300/40 dark:hover:bg-ink-500/30",
      )}
      onClick={onClick}
    >
      <div className="w-[60px] shrink-0 text-xs text-ink-300 dark:text-ink-200">
        {formatTime(event.datetime)}
      </div>

      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-400 dark:text-ink-100",
          event.category === "work" && "bg-flame-500/15",
          event.category === "personal" && "bg-blue-500/15",
          event.category === "general" && "bg-cream-300 dark:bg-ink-600",
          event.category === "health" && "bg-green-500/15",
          event.category === "social" && "bg-purple-500/15",
        )}
      >
        <Icon size={14} />
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 text-sm font-medium",
          event.completed && "text-ink-300 line-through dark:text-ink-200",
        )}
      >
        <div className="truncate">{event.title}</div>
        {event.location ? (
          <div className="truncate text-xs text-ink-300 dark:text-ink-200">
            {event.location}
          </div>
        ) : null}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={event.completed ? "Mark as not done" : "Mark as done"}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          event.completed
            ? "border-flame-500 bg-flame-500 text-white"
            : "border-cream-500 hover:border-flame-400 dark:border-ink-400",
        )}
      >
        {event.completed ? <Check size={12} strokeWidth={3} /> : null}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete event"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-flame-500/60 opacity-60 transition-opacity hover:bg-flame-500/10 hover:opacity-100 focus:opacity-100"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
