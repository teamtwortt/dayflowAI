import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, ListChecks } from "lucide-react";

import { EventList } from "../components/dashboard/EventList";
import { EventModal } from "../components/dashboard/EventModal";
import { CalendarWeek } from "../components/dashboard/CalendarWeek";
import { CalendarMonth } from "../components/dashboard/CalendarMonth";
import { SectionHeader } from "../components/dashboard/SectionHeader";
import { useEvents } from "../hooks/useEvents";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/cn";
import type { DayflowEvent } from "../api/types";

type ViewMode = "list" | "week" | "month";

export default function Plan() {
  const events = useEvents();
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DayflowEvent | null>(null);
  const [initialDate, setInitialDate] = useState<Date | null>(null);

  function openCreate(when: Date | null = null) {
    setEditing(null);
    setInitialDate(when);
    setModalOpen(true);
  }

  function openEdit(event: DayflowEvent) {
    setEditing(event);
    setInitialDate(null);
    setModalOpen(true);
  }

  function step(delta: 1 | -1) {
    setAnchor((prev) => {
      if (view === "week") return addWeeks(prev, delta);
      if (view === "month") return addMonths(prev, delta);
      return addDays(prev, delta);
    });
  }

  const heading = useMemo(() => {
    if (view === "week") {
      const start = anchor;
      const end = addDays(anchor, 6);
      return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
    }
    if (view === "month") return format(anchor, "MMMM yyyy");
    return format(anchor, "EEEE, MMM d");
  }, [view, anchor]);

  const initialEventValues = initialDate
    ? {
        datetime: initialDate.toISOString().slice(0, 16),
      }
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5 flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your plan</h2>
          <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
            {heading}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-cream-400/60 bg-cream-200 p-1 dark:border-ink-500/40 dark:bg-ink-600">
            <ViewToggle current={view} value="list" onChange={setView} Icon={ListChecks}>
              List
            </ViewToggle>
            <ViewToggle current={view} value="week" onChange={setView} Icon={CalendarDays}>
              Week
            </ViewToggle>
            <ViewToggle current={view} value="month" onChange={setView} Icon={CalendarDays}>
              Month
            </ViewToggle>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => step(-1)}
              aria-label="Previous"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-cream-400/60 text-ink-400 hover:bg-cream-200 dark:border-ink-500/40 dark:text-ink-100 dark:hover:bg-ink-600"
            >
              <ChevronLeft size={16} />
            </button>
            <Button variant="secondary" size="sm" onClick={() => setAnchor(new Date())}>
              Today
            </Button>
            <button
              onClick={() => step(1)}
              aria-label="Next"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-cream-400/60 text-ink-400 hover:bg-cream-200 dark:border-ink-500/40 dark:text-ink-100 dark:hover:bg-ink-600"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {events.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : view === "list" ? (
        <>
          <SectionHeader title="All events" onAdd={() => openCreate(null)} />
          <ListView events={events.data ?? []} onEventClick={openEdit} />
        </>
      ) : view === "week" ? (
        <CalendarWeek
          events={events.data ?? []}
          anchor={anchor}
          onEventClick={openEdit}
          onSlotClick={(when) => openCreate(when)}
        />
      ) : (
        <CalendarMonth
          events={events.data ?? []}
          anchor={anchor}
          onEventClick={openEdit}
          onDayClick={(day) => {
            const slot = new Date(day);
            slot.setHours(9, 0, 0, 0);
            openCreate(slot);
          }}
        />
      )}

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editing}
        initial={initialEventValues}
      />
    </div>
  );
}

interface ViewToggleProps {
  current: ViewMode;
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  Icon: typeof CalendarDays;
  children: React.ReactNode;
}

function ViewToggle({ current, value, onChange, Icon, children }: ViewToggleProps) {
  const active = current === value;
  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-flame-500 text-white shadow-glow"
          : "text-ink-400 hover:bg-cream-300 dark:text-ink-100 dark:hover:bg-ink-500/50",
      )}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function ListView({
  events,
  onEventClick,
}: {
  events: DayflowEvent[];
  onEventClick: (e: DayflowEvent) => void;
}) {
  const groups = useMemo(() => {
    const g: Record<string, DayflowEvent[]> = {};
    for (const e of events) {
      const k = e.datetime.slice(0, 10);
      if (!g[k]) g[k] = [];
      g[k].push(e);
    }
    return g;
  }, [events]);
  const keys = Object.keys(groups).sort();

  if (keys.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink-300 dark:text-ink-200">
        No upcoming events — use the + button or just type one above.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {keys.map((day) => (
        <section key={day}>
          <h3 className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wider text-flame-500">
            {format(new Date(day + "T00:00:00"), "EEEE, MMMM d")}
          </h3>
          <EventList events={groups[day]} loading={false} onEventClick={onEventClick} />
        </section>
      ))}
    </div>
  );
}
