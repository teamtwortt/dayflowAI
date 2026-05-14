import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { EventList } from "../components/dashboard/EventList";
import { EventModal } from "../components/dashboard/EventModal";
import { useEvents } from "../hooks/useEvents";
import type { DayflowEvent } from "../api/types";

export default function Tasks() {
  const events = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DayflowEvent | null>(null);

  const { open, completed } = useMemo(() => {
    const all = events.data ?? [];
    return {
      open: all.filter((e) => !e.completed),
      completed: all.filter((e) => e.completed),
    };
  }, [events.data]);

  function openEdit(event: DayflowEvent) {
    setEditing(event);
    setModalOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6 lg:max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
          Tick things off as you go.
        </p>
      </motion.div>

      <h3 className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wider text-flame-500">
        Open
      </h3>
      <EventList
        events={open}
        loading={events.isLoading}
        onEventClick={openEdit}
        emptyMessage="All clear! No open tasks."
      />

      {completed.length > 0 ? (
        <>
          <h3 className="mb-1 mt-6 text-[0.72rem] font-semibold uppercase tracking-wider text-flame-500">
            Completed
          </h3>
          <EventList events={completed} loading={false} onEventClick={openEdit} />
        </>
      ) : null}

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editing}
      />
    </div>
  );
}
