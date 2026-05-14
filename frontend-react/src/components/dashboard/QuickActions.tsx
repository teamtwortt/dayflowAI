import { Bell, CalendarDays, CheckSquare, Heart, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { cn } from "../../lib/cn";

const actions = [
  { id: "schedule", label: "Schedule", Icon: CalendarDays },
  { id: "tasks", label: "Tasks", Icon: CheckSquare },
  { id: "reminders", label: "Reminders", Icon: Bell },
  { id: "wellness", label: "Wellness", Icon: Heart },
  { id: "more", label: "More", Icon: MoreHorizontal },
];

export function QuickActions() {
  const [active, setActive] = useState("schedule");

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {actions.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 transition-all",
              "min-w-[68px]",
              isActive
                ? "border-flame-500 bg-flame-500 text-white shadow-glow"
                : "border-cream-400/60 bg-cream-200 text-ink-400 hover:bg-cream-300/70 dark:border-ink-500/40 dark:bg-ink-600 dark:text-ink-100 dark:hover:bg-ink-500/60",
            )}
          >
            <Icon size={18} />
            <span className="text-[0.68rem] font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
