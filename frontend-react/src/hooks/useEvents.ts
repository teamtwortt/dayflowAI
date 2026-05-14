import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
} from "../api/events";
import { extractError } from "../api/client";
import type {
  DayflowEvent,
  EventCreatePayload,
  EventUpdatePayload,
} from "../api/types";

export const eventsKey = ["events"] as const;

export function useEvents() {
  return useQuery({
    queryKey: eventsKey,
    queryFn: listEvents,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventCreatePayload) => createEvent(payload),
    onSuccess: (created) => {
      qc.setQueryData<DayflowEvent[]>(eventsKey, (prev) => {
        const next = [...(prev ?? []), created];
        next.sort((a, b) => a.datetime.localeCompare(b.datetime));
        return next;
      });
      qc.invalidateQueries({ queryKey: ["briefing"] });
      toast.success("Event added");
    },
    onError: (err) => {
      toast.error(extractError(err, "Could not add event"));
    },
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      patch,
    }: {
      eventId: string;
      patch: EventUpdatePayload;
    }) => updateEvent(eventId, patch),
    onMutate: async ({ eventId, patch }) => {
      await qc.cancelQueries({ queryKey: eventsKey });
      const previous = qc.getQueryData<DayflowEvent[]>(eventsKey);
      qc.setQueryData<DayflowEvent[]>(eventsKey, (prev) =>
        (prev ?? []).map((e) =>
          e.eventId === eventId ? { ...e, ...patch } : e,
        ),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(eventsKey, ctx.previous);
      toast.error(extractError(err, "Could not update event"));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: eventsKey });
      qc.invalidateQueries({ queryKey: ["briefing"] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onMutate: async (eventId) => {
      await qc.cancelQueries({ queryKey: eventsKey });
      const previous = qc.getQueryData<DayflowEvent[]>(eventsKey);
      qc.setQueryData<DayflowEvent[]>(eventsKey, (prev) =>
        (prev ?? []).filter((e) => e.eventId !== eventId),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(eventsKey, ctx.previous);
      toast.error(extractError(err, "Could not delete event"));
    },
    onSuccess: () => {
      toast.success("Event deleted");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["briefing"] });
    },
  });
}
