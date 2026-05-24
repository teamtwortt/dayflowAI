import { AnimatePresence } from "framer-motion";
import { ListTodo } from "lucide-react";

import { TaskRow } from "./TaskRow";
import { Skeleton } from "../ui/Skeleton";
import { useDeleteTask, useUpdateTask } from "../../hooks/useTasks";
import type { DayflowTask } from "../../api/types";

interface TaskListProps {
  tasks: DayflowTask[] | undefined;
  loading: boolean;
  onTaskClick?: (task: DayflowTask) => void;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  loading,
  onTaskClick,
  emptyMessage = "No tasks yet — add one!",
}: TaskListProps) {
  const deleteMut = useDeleteTask();
  const updateMut = useUpdateTask();

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flame-500/10 text-flame-500">
          <ListTodo size={22} />
        </div>
        <p className="text-sm text-ink-300 dark:text-ink-200">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {tasks.map((t) => (
          <TaskRow
            key={t.taskId}
            task={t}
            onClick={onTaskClick ? () => onTaskClick(t) : undefined}
            onToggle={() =>
              updateMut.mutate({
                taskId: t.taskId,
                patch: { completed: !t.completed },
              })
            }
            onDelete={() => deleteMut.mutate(t.taskId)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
