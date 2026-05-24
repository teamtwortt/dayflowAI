import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FocusCard } from "../components/dashboard/FocusCard";
import { QuickActions } from "../components/dashboard/QuickActions";
import { EventList } from "../components/dashboard/EventList";
import { EventModal } from "../components/dashboard/EventModal";
import { AIQuickAdd } from "../components/dashboard/AIQuickAdd";
import { WeatherCard } from "../components/dashboard/WeatherCard";
import { TrafficCard } from "../components/dashboard/TrafficCard";
import { Greeting } from "../components/dashboard/Greeting";
import { SectionHeader } from "../components/dashboard/SectionHeader";
import { useEvents } from "../hooks/useEvents";
import { useBriefing } from "../hooks/useBriefing";
import { useAddEventTrigger } from "../components/layout/addEventContext";
import { useProfile } from "../hooks/useProfile";
import { startsWithToday } from "../lib/format";
import { decodeIdTokenClaims, displayNameFromClaims } from "../lib/idTokenClaims";
import { useAuthStore } from "../store/auth";
import type { DayflowEvent } from "../api/types";

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
  const briefing = useBriefing();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DayflowEvent | null>(null);
  const { openTrigger } = useAddEventTrigger();

  useEffect(() => {
    if (openTrigger > 0) {
      setEditing(null);
      setModalOpen(true);
    }
  }, [openTrigger]);

  const todays = (events.data ?? []).filter((e) => startsWithToday(e.datetime));

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(event: DayflowEvent) {
    setEditing(event);
    setModalOpen(true);
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

      <QuickActions />

      <SectionHeader
        title="Today's plan"
        onViewAll={() => navigate("/plan")}
        onAdd={openCreate}
      />

      <EventList
        events={todays}
        loading={events.isLoading}
        onEventClick={openEdit}
        emptyMessage="Nothing on the calendar today — use the box above or tap + to add an event."
      />

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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editing}
      />
    </div>
  );
}
