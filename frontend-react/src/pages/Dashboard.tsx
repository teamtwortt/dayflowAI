import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FocusCard } from "../components/dashboard/FocusCard";
import {
  QuickActions,
  type QuickActionId,
} from "../components/dashboard/QuickActions";
import { EventList } from "../components/dashboard/EventList";
import { EventModal } from "../components/dashboard/EventModal";
import { TaskList } from "../components/dashboard/TaskList";
import { TaskModal } from "../components/dashboard/TaskModal";
import { RemindersSummary } from "../components/dashboard/RemindersSummary";
import { AIQuickAdd } from "../components/dashboard/AIQuickAdd";
import { WeatherCard } from "../components/dashboard/WeatherCard";
import { TrafficCard } from "../components/dashboard/TrafficCard";
import { Greeting } from "../components/dashboard/Greeting";
import { SectionHeader } from "../components/dashboard/SectionHeader";
import { useEvents } from "../hooks/useEvents";
import { useTasks } from "../hooks/useTasks";
import { useBriefing } from "../hooks/useBriefing";
import { useAddEventTrigger } from "../components/layout/addEventContext";
import { useProfile } from "../hooks/useProfile";
import { startsWithToday } from "../lib/format";
import { decodeIdTokenClaims, displayNameFromClaims } from "../lib/idTokenClaims";
import { useAuthStore } from "../store/auth";
import type { DayflowEvent, DayflowTask } from "../api/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = useProfile();
  const authEmail = useAuthStore((s) => s.email);
  const idToken = useAuthStore((s) => s.token);
  const tokenClaims = decodeIdTokenClaims(idToken);

  const greetingName =
    profile.data?.name?.trim() ||
    displayNameFromClaims(tokenClaims) ||
    profile.data?.email?.split("@")[0] ||
    authEmail?.split("@")[0];

  const events = useEvents();
  const tasksQuery = useTasks();
  const briefing = useBriefing();
  const [panel, setPanel] = useState<QuickActionId>("schedule");
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DayflowEvent | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DayflowTask | null>(null);
  const { openTrigger } = useAddEventTrigger();

  useEffect(() => {
    if (openTrigger > 0) {
      setPanel("schedule");
      setEditingEvent(null);
      setEventModalOpen(true);
    }
  }, [openTrigger]);

  const todays = (events.data ?? []).filter((e) => startsWithToday(e.datetime));

  const openTasks = useMemo(
    () => (tasksQuery.data ?? []).filter((t) => !t.completed),
    [tasksQuery.data],
  );

  function openCreateEvent() {
    setEditingEvent(null);
    setEventModalOpen(true);
  }

  function openEditEvent(event: DayflowEvent) {
    setEditingEvent(event);
    setEventModalOpen(true);
  }

  function openCreateTask() {
    setEditingTask(null);
    setTaskModalOpen(true);
  }

  function openEditTask(task: DayflowTask) {
    setEditingTask(task);
    setTaskModalOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6 lg:max-w-4xl">
      <Greeting
        serverGreeting={briefing.data?.greeting}
        summary={briefing.data?.summary}
        name={greetingName}
      />

      <FocusCard events={events.data} loading={events.isLoading} />

      <AIQuickAdd />

      <QuickActions value={panel} onChange={setPanel} />

      {panel === "schedule" ? (
        <>
          <SectionHeader
            title="Today's plan"
            onViewAll={() => navigate("/plan")}
            onAdd={openCreateEvent}
          />
          <EventList
            events={todays}
            loading={events.isLoading}
            onEventClick={openEditEvent}
            emptyMessage="Nothing on the calendar today — use the box above or tap + to add an event."
          />
        </>
      ) : null}

      {panel === "tasks" ? (
        <>
          <SectionHeader
            title="Open tasks"
            onViewAll={() => navigate("/tasks")}
            onAdd={openCreateTask}
            addLabel="Add task"
          />
          <TaskList
            tasks={openTasks}
            loading={tasksQuery.isLoading}
            onTaskClick={openEditTask}
            emptyMessage="No open tasks — tap Add task or use View all."
          />
        </>
      ) : null}

      {panel === "reminders" ? (
        <>
          <SectionHeader title="Reminders" />
          <RemindersSummary
            preferences={profile.data?.preferences}
            loading={profile.isLoading}
          />
        </>
      ) : null}

      <div className="mt-5 space-y-3">
        <TrafficCard />
        <WeatherCard
          weather={briefing.data?.weather}
          advice={briefing.data?.advice}
          loading={briefing.isLoading}
          error={briefing.isError}
          onRetry={() => void briefing.refetch()}
        />
      </div>

      <EventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        event={editingEvent}
      />

      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
}
