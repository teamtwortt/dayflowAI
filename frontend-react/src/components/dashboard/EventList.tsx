import { AnimatePresence } from "framer-motion";
import { CalendarPlus } from "lucide-react";

import { EventRow } from "./EventRow";
import { Skeleton } from "../ui/Skeleton";
import { useDeleteEvent, useUpdateEvent } from "../../hooks/useEvents";
import type { DayflowEvent } from "../../api/types";

interface EventListProps {
  events: DayflowEvent[] | undefined;
  loading: boolean;
  onEventClick?: (event: DayflowEvent) => void;
  emptyMessage?: string;
}

export function EventList({
  events,
  loading,
  onEventClick,
  emptyMessage = "No events yet — tap + to add one!",
}: EventListProps) {
  const deleteMut = useDeleteEvent();
  const updateMut = useUpdateEvent();

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flame-500/10 text-flame-500">
          <CalendarPlus size={22} />
        </div>
        <p className="text-sm text-ink-300 dark:text-ink-200">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {events.map((e) => (
          <EventRow
            key={e.eventId}
            event={e}
            onClick={onEventClick ? () => onEventClick(e) : undefined}
            onToggle={() =>
              updateMut.mutate({
                eventId: e.eventId,
                patch: { completed: !e.completed },
              })
            }
            onDelete={() => deleteMut.mutate(e.eventId)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
