import { api } from "./client";
import type {
  DayflowTask,
  TaskCreatePayload,
  TaskUpdatePayload,
} from "./types";

export async function listTasks(): Promise<DayflowTask[]> {
  const { data } = await api.get<DayflowTask[]>("/tasks");
  return data;
}

export async function createTask(
  payload: TaskCreatePayload,
): Promise<DayflowTask> {
  const { data } = await api.post<DayflowTask>("/tasks", payload);
  return data;
}

export async function updateTask(
  taskId: string,
  payload: TaskUpdatePayload,
): Promise<DayflowTask> {
  const { data } = await api.put<DayflowTask>(`/tasks/${taskId}`, payload);
  return data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}
