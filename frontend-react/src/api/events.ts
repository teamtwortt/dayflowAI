import { api } from "./client";
import type { DayflowEvent, EventCreatePayload, EventUpdatePayload } from "./types";

export async function listEvents(): Promise<DayflowEvent[]> {
  const { data } = await api.get<DayflowEvent[]>("/events");
  return data;
}

export async function createEvent(
  payload: EventCreatePayload,
): Promise<DayflowEvent> {
  const { data } = await api.post<DayflowEvent>("/events", payload);
  return data;
}

export async function updateEvent(
  eventId: string,
  payload: EventUpdatePayload,
): Promise<DayflowEvent> {
  const { data } = await api.put<DayflowEvent>(`/events/${eventId}`, payload);
  return data;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await api.delete(`/events/${eventId}`);
}
