import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

import { Button } from "../ui/Button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";

export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(
    localStorage.getItem(DISMISS_KEY) === "1",
  );

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (hidden || !event) return null;

  async function install() {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === "accepted") {
      setEvent(null);
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setHidden(true);
  }

  return (
    <div className="surface-elevated fixed bottom-24 left-4 right-4 z-30 mx-auto flex max-w-md items-center gap-3 rounded-2xl p-3 shadow-soft md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-flame-500/15 text-flame-500">
        <Download size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">Install DayFlow AI</div>
        <div className="text-xs text-ink-300 dark:text-ink-200">
          Get fast access from your home screen.
        </div>
      </div>
      <Button size="sm" onClick={install}>
        Install
      </Button>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-300 hover:bg-cream-300/70 dark:text-ink-200 dark:hover:bg-ink-500/40"
      >
        <X size={14} />
      </button>
    </div>
  );
}
