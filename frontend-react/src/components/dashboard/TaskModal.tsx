import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from "../../hooks/useTasks";
import type { DayflowTask, TaskPriority } from "../../api/types";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: DayflowTask | null;
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

/** Next hour aligned for sensible default deadline in datetime-local input */
function nextHourSlot(): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toISOString().slice(0, 16);
}

function toLocalInput(iso?: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export function TaskModal({ open, onClose, task }: TaskModalProps) {
  const isEdit = !!task;
  const [title, setTitle] = useState("");
  const [dueEnabled, setDueEnabled] = useState(false);
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [notes, setNotes] = useState("");

  const create = useCreateTask();
  const update = useUpdateTask();
  const del = useDeleteTask();

  useEffect(() => {
    if (!open) return;
    const t = task;
    setTitle(t?.title ?? "");
    const d = t?.dueDate ?? null;
    setDueEnabled(!!d);
    setDue(d ? toLocalInput(d) : nextHourSlot());
    setPriority((t?.priority as TaskPriority) ?? "medium");
    setNotes(t?.notes ?? "");
  }, [open, task]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const dueDate =
      dueEnabled && due.trim()
        ? new Date(due.trim()).toISOString()
        : undefined;
    const payload = {
      title: title.trim(),
      priority,
      notes: notes.trim() || null,
      dueDate,
    };
    if (isEdit && task) {
      await update.mutateAsync({ taskId: task.taskId, patch: payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  }

  async function handleDelete() {
    if (!task) return;
    if (!confirm("Delete this task?")) return;
    await del.mutateAsync(task.taskId);
    onClose();
  }

  const saving = create.isPending || update.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit task" : "New task"}
      description={
        isEdit
          ? "Update or remove this to-do."
          : "Stored in your tasks table — separate from scheduled events."
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
            placeholder="What needs doing?"
            required
            autoFocus
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-400 dark:text-ink-200">
            <input
              type="checkbox"
              checked={dueEnabled}
              onChange={(e) => {
                const on = e.target.checked;
                setDueEnabled(on);
                if (on && !due) setDue(nextHourSlot());
              }}
              className="rounded border-cream-400"
            />
            Due date / time
          </label>
        </div>

        {dueEnabled ? (
          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
              When
            </label>
            <Input
              type="datetime-local"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
            Priority
          </label>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
            Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional context"
            rows={3}
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" loading={saving}>
            {isEdit ? "Save changes" : "Add task"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {isEdit && task ? (
            <Button
              type="button"
              variant="ghost"
              className="text-flame-600"
              loading={del.isPending}
              onClick={() => void handleDelete()}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
