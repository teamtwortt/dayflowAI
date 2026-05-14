import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from "../../hooks/useEvents";
import type {
  DayflowEvent,
  EventCategory,
  EventPriority,
} from "../../api/types";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  /** Pass an event to edit. Pass null/undefined to create. */
  event?: DayflowEvent | null;
  /** Optional pre-filled values when creating (e.g. from NL parser). */
  initial?: Partial<DayflowEvent> | null;
}

const CATEGORIES: EventCategory[] = ["work", "personal", "general", "health", "social"];
const PRIORITIES: EventPriority[] = ["low", "medium", "high"];

function nextHourSlot(): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toISOString().slice(0, 16);
}

function toLocalInput(iso?: string | null): string {
  if (!iso) return nextHourSlot();
  // Strip seconds & timezone for <input type="datetime-local">
  return iso.slice(0, 16);
}

export function EventModal({ open, onClose, event, initial }: EventModalProps) {
  const isEdit = !!event;
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState(nextHourSlot());
  const [category, setCategory] = useState<EventCategory>("work");
  const [priority, setPriority] = useState<EventPriority>("medium");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const create = useCreateEvent();
  const update = useUpdateEvent();
  const del = useDeleteEvent();

  useEffect(() => {
    if (!open) return;
    const src = event ?? initial ?? null;
    setTitle(src?.title ?? "");
    setDatetime(toLocalInput(src?.datetime));
    setCategory((src?.category as EventCategory) ?? "work");
    setPriority((src?.priority as EventPriority) ?? "medium");
    setLocation(src?.location ?? "");
    setNotes(src?.notes ?? "");
  }, [open, event, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !datetime) return;
    const payload = {
      title,
      datetime,
      category,
      priority,
      location: location || null,
      notes: notes || null,
    };
    if (isEdit && event) {
      await update.mutateAsync({ eventId: event.eventId, patch: payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  }

  async function handleDelete() {
    if (!event) return;
    if (!confirm("Delete this event?")) return;
    await del.mutateAsync(event.eventId);
    onClose();
  }

  const saving = create.isPending || update.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit event" : "New event"}
      description={
        isEdit
          ? "Update or remove this entry."
          : "Anything you add here syncs to your dashboard, plan, and briefing."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's happening?"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
              When
            </label>
            <Input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
              Priority
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as EventPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
            Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything you want to remember..."
            maxLength={1000}
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <div>
            {isEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                loading={del.isPending}
                className="text-red-500 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={saving}
              disabled={!title || !datetime}
            >
              {isEdit ? "Save changes" : "Create event"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
