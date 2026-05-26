import { Bell, CalendarDays, CheckSquare } from "lucide-react";

import { cn } from "../../lib/cn";

export type QuickActionId = "schedule" | "tasks" | "reminders";

const actions: { id: QuickActionId; label: string; Icon: typeof CalendarDays }[] = [
  { id: "schedule", label: "Schedule", Icon: CalendarDays },
  { id: "tasks", label: "Tasks", Icon: CheckSquare },
  { id: "reminders", label: "Reminders", Icon: Bell },
];

interface QuickActionsProps {
  value: QuickActionId;
  onChange: (id: QuickActionId) => void;
}

export function QuickActions({ value, onChange }: QuickActionsProps) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {actions.map(({ id, label, Icon }) => {
        const isActive = id === value;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 transition-all",
              "min-w-[68px]",
              isActive
                ? "border-flame-500 bg-flame-500 text-white shadow-glow"
                : "border-cream-400/60 bg-cream-200 text-ink-400 hover:bg-cream-300/70 dark:border-ink-500/40 dark:bg-ink-600 dark:text-ink-100 dark:hover:bg-ink-500/60",
            )}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
