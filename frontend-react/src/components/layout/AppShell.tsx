import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { CommandPalette } from "./CommandPalette";
import { InstallPrompt } from "./InstallPrompt";
import { OnboardingWizard } from "../onboarding/OnboardingWizard";
import { AddEventContext } from "./addEventContext";
import { useProfile } from "../../hooks/useProfile";

export default function AppShell() {
  const [openCounter, setOpenCounter] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const profile = useProfile();

  // Show onboarding once: when profile loads and user hasn't been onboarded
  useEffect(() => {
    if (!profile.data) return;
    const flag = localStorage.getItem("onboarded");
    const looksDefault =
      profile.data.preferences.city === "Washington DC" &&
      profile.data.preferences.briefing_time === "07:00";
    if (!flag && looksDefault) {
      setOnboardingOpen(true);
    }
  }, [profile.data]);

  // Global keyboard shortcuts (Cmd/Ctrl+K for palette, N for new event)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (!isTyping && e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpenCounter((c) => c + 1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AddEventContext.Provider
      value={{
        openTrigger: openCounter,
        triggerOpen: () => setOpenCounter((c) => c + 1),
      }}
    >
      <div className="flex min-h-screen">
        <Sidebar onOpenPalette={() => setPaletteOpen(true)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav onOpenPalette={() => setPaletteOpen(true)} />
          <main className="flex-1 pb-24 md:pb-8">
            <Outlet />
          </main>
        </div>

        <BottomNav onFabClick={() => setOpenCounter((c) => c + 1)} />

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onAddEvent={() => setOpenCounter((c) => c + 1)}
        />

        <OnboardingWizard
          open={onboardingOpen}
          onClose={() => setOnboardingOpen(false)}
        />

        <InstallPrompt />
      </div>
    </AddEventContext.Provider>
  );
}
