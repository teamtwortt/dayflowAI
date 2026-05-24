import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { TaskList } from "../components/dashboard/TaskList";
import { TaskModal } from "../components/dashboard/TaskModal";
import { Button } from "../components/ui/Button";
import { useTasks } from "../hooks/useTasks";
import type { DayflowTask } from "../api/types";

export default function Tasks() {
  const tasksQuery = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DayflowTask | null>(null);

  const { open, completed } = useMemo(() => {
    const all = tasksQuery.data ?? [];
    return {
      open: all.filter((t) => !t.completed),
      completed: all.filter((t) => t.completed),
    };
  }, [tasksQuery.data]);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(task: DayflowTask) {
    setEditing(task);
    setModalOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6 lg:max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
            Stored in DynamoDB table <span className="font-medium">tasks</span> —
            separate from <span className="font-medium">schedules</span>.
          </p>
        </div>
        <Button onClick={openNew} size="sm" className="shrink-0 gap-2">
          <Plus size={16} />
          New task
        </Button>
      </motion.div>

      <h3 className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wider text-flame-500">
        Open
      </h3>
      <TaskList
        tasks={open}
        loading={tasksQuery.isLoading}
        onTaskClick={openEdit}
        emptyMessage="All clear! No open tasks."
      />

      {completed.length > 0 ? (
        <>
          <h3 className="mb-1 mt-6 text-[0.72rem] font-semibold uppercase tracking-wider text-flame-500">
            Completed
          </h3>
          <TaskList tasks={completed} loading={false} onTaskClick={openEdit} />
        </>
      ) : null}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editing}
      />
    </div>
  );
}
