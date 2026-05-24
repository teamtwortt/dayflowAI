import { Check, ListTodo, X } from "lucide-react";
import { motion } from "framer-motion";

import type { DayflowTask } from "../../api/types";
import { formatDateLabel, formatTime } from "../../lib/format";
import { cn } from "../../lib/cn";

function formatDueLabel(iso: string | null | undefined): string {
  if (!iso) return "";
  const hasTime = iso.length > 10; // date-only vs datetime
  try {
    const datePart = formatDateLabel(iso);
    if (hasTime) return `${datePart} · ${formatTime(iso)}`;
    return datePart;
  } catch {
    return iso;
  }
}

interface TaskRowProps {
  task: DayflowTask;
  onToggle: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

export function TaskRow({ task, onToggle, onDelete, onClick }: TaskRowProps) {
  const dueLabel = formatDueLabel(task.dueDate ?? undefined);
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
      <div className="w-[120px] shrink-0 text-xs text-ink-300 dark:text-ink-200">
        {dueLabel || "—"}
      </div>

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-flame-500/15 text-flame-600 dark:text-flame-400">
        <ListTodo size={14} />
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 text-base font-medium",
          task.completed && "text-ink-300 line-through dark:text-ink-200",
        )}
      >
        <div className="truncate">{task.title}</div>
        {task.notes ? (
          <div className="truncate text-sm text-ink-300 dark:text-ink-200">
            {task.notes}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={task.completed ? "Mark as not done" : "Mark as done"}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.completed
            ? "border-flame-500 bg-flame-500 text-white"
            : "border-cream-500 hover:border-flame-400 dark:border-ink-400",
        )}
      >
        {task.completed ? <Check size={12} strokeWidth={3} /> : null}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete task"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-flame-500/60 opacity-60 transition-opacity hover:bg-flame-500/10 hover:opacity-100 focus:opacity-100"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
