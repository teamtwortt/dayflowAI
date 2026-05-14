import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CalendarPlus,
  CheckSquare,
  Home,
  LineChart,
  LogOut,
  Moon,
  Search,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Modal } from "../ui/Modal";
import { Kbd } from "../ui/Kbd";
import { useEvents } from "../../hooks/useEvents";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth";
import { formatTime } from "../../lib/format";
import { cn } from "../../lib/cn";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onAddEvent: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  Icon: typeof Home;
  onSelect: () => void;
  group: "Navigate" | "Actions" | "Events";
}

export function CommandPalette({ open, onClose, onAddEvent }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const events = useEvents();
  const { theme, toggle } = useTheme();
  const clearSession = useAuthStore((s) => s.clearSession);
  const qc = useQueryClient();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const nav: CommandItem[] = [
      {
        id: "go-dashboard",
        label: "Go to Dashboard",
        Icon: Home,
        group: "Navigate",
        onSelect: () => {
          navigate("/dashboard");
          onClose();
        },
      },
      {
        id: "go-plan",
        label: "Go to Plan",
        Icon: CalendarDays,
        group: "Navigate",
        onSelect: () => {
          navigate("/plan");
          onClose();
        },
      },
      {
        id: "go-tasks",
        label: "Go to Tasks",
        Icon: CheckSquare,
        group: "Navigate",
        onSelect: () => {
          navigate("/tasks");
          onClose();
        },
      },
      {
        id: "go-insights",
        label: "Go to Insights",
        Icon: LineChart,
        group: "Navigate",
        onSelect: () => {
          navigate("/insights");
          onClose();
        },
      },
      {
        id: "go-assistant",
        label: "Go to Assistant",
        Icon: Sparkles,
        group: "Navigate",
        onSelect: () => {
          navigate("/assistant");
          onClose();
        },
      },
      {
        id: "go-profile",
        label: "Go to Profile",
        Icon: User,
        group: "Navigate",
        onSelect: () => {
          navigate("/profile");
          onClose();
        },
      },
    ];

    const actions: CommandItem[] = [
      {
        id: "new-event",
        label: "Create new event",
        hint: "N",
        Icon: CalendarPlus,
        group: "Actions",
        onSelect: () => {
          onAddEvent();
          onClose();
        },
      },
      {
        id: "toggle-theme",
        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        Icon: theme === "dark" ? Sun : Moon,
        group: "Actions",
        onSelect: () => {
          toggle();
          onClose();
        },
      },
      {
        id: "logout",
        label: "Sign out",
        Icon: LogOut,
        group: "Actions",
        onSelect: () => {
          qc.clear();
          clearSession();
          onClose();
          navigate("/", { replace: true });
        },
      },
    ];

    const eventItems: CommandItem[] = (events.data ?? []).slice(0, 30).map((e) => ({
      id: `evt-${e.eventId}`,
      label: e.title,
      hint: `${e.datetime.slice(0, 10)} · ${formatTime(e.datetime)}`,
      Icon: CalendarDays,
      group: "Events" as const,
      onSelect: () => {
        navigate(`/plan?focus=${encodeURIComponent(e.eventId)}`);
        onClose();
      },
    }));

    return [...nav, ...actions, ...eventItems];
  }, [navigate, onAddEvent, onClose, theme, toggle, clearSession, qc, events.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.onSelect();
    }
  }

  // Group while preserving filter order
  const grouped: Record<string, CommandItem[]> = {};
  for (const item of filtered) {
    if (!grouped[item.group]) grouped[item.group] = [];
    grouped[item.group].push(item);
  }

  return (
    <Modal open={open} onClose={onClose} size="lg" hideClose>
      <div className="-mx-5 -mt-3">
        <div className="flex items-center gap-3 border-b border-cream-300/60 px-5 py-3 dark:border-ink-500/40">
          <Search size={16} className="text-ink-300 dark:text-ink-200" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type to search events, jump to a page, or run a command..."
            className="flex-1 bg-transparent text-sm text-ink-700 placeholder:text-ink-200 focus:outline-none dark:text-ink-50 dark:placeholder:text-ink-300"
          />
          <Kbd>esc</Kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-300 dark:text-ink-200">
              No matches.
            </p>
          ) : (
            Object.entries(grouped).map(([group, list]) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="px-3 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-flame-500">
                  {group}
                </div>
                {list.map((item) => {
                  const idx = filtered.indexOf(item);
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onSelect}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm",
                        isActive
                          ? "bg-flame-500/15 text-flame-700 dark:bg-flame-500/20 dark:text-flame-100"
                          : "text-ink-400 hover:bg-cream-300/50 dark:text-ink-100 dark:hover:bg-ink-500/40",
                      )}
                    >
                      <item.Icon size={16} />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint ? (
                        <span className="text-[0.7rem] text-ink-300 dark:text-ink-200">
                          {item.hint}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-cream-300/60 px-5 py-2 text-[0.65rem] text-ink-300 dark:border-ink-500/40 dark:text-ink-200">
          <div className="flex items-center gap-2">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>↵</Kbd>
            <span>select</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
