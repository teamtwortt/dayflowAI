import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "../api/tasks";
import { extractError } from "../api/client";
import type {
  DayflowTask,
  TaskCreatePayload,
  TaskUpdatePayload,
} from "../api/types";

export const tasksKey = ["tasks"] as const;

export function useTasks() {
  return useQuery({
    queryKey: tasksKey,
    queryFn: listTasks,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskCreatePayload) => createTask(payload),
    onSuccess: (created) => {
      qc.setQueryData<DayflowTask[]>(tasksKey, (prev) => {
        const next = [...(prev ?? []), created];
        next.sort((a, b) => {
          const byDue = (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
          if (byDue !== 0) return byDue;
          return a.createdAt.localeCompare(b.createdAt);
        });
        return next;
      });
      toast.success("Task added");
    },
    onError: (err) => {
      toast.error(extractError(err, "Could not add task"));
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      patch,
    }: {
      taskId: string;
      patch: TaskUpdatePayload;
    }) => updateTask(taskId, patch),
    onMutate: async ({ taskId, patch }) => {
      await qc.cancelQueries({ queryKey: tasksKey });
      const previous = qc.getQueryData<DayflowTask[]>(tasksKey);
      qc.setQueryData<DayflowTask[]>(tasksKey, (prev) =>
        (prev ?? []).map((t) =>
          t.taskId === taskId ? { ...t, ...patch } : t,
        ),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(tasksKey, ctx.previous);
      toast.error(extractError(err, "Could not update task"));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: tasksKey });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onMutate: async (taskId) => {
      await qc.cancelQueries({ queryKey: tasksKey });
      const previous = qc.getQueryData<DayflowTask[]>(tasksKey);
      qc.setQueryData<DayflowTask[]>(tasksKey, (prev) =>
        (prev ?? []).filter((t) => t.taskId !== taskId),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(tasksKey, ctx.previous);
      toast.error(extractError(err, "Could not delete task"));
    },
    onSuccess: () => {
      toast.success("Task deleted");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: tasksKey });
    },
  });
}
