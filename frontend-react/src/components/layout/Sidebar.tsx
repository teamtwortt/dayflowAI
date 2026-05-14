import {
  CalendarDays,
  CheckSquare,
  Home,
  LineChart,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Logo } from "../ui/Logo";
import { Kbd } from "../ui/Kbd";
import { useAuthStore } from "../../store/auth";
import { cn } from "../../lib/cn";

const items = [
  { to: "/dashboard", label: "Home", Icon: Home },
  { to: "/plan", label: "Plan", Icon: CalendarDays },
  { to: "/tasks", label: "Tasks", Icon: CheckSquare },
  { to: "/assistant", label: "Assistant", Icon: Sparkles },
  { to: "/insights", label: "Insights", Icon: LineChart },
  { to: "/profile", label: "Profile", Icon: User },
];

interface SidebarProps {
  onOpenPalette: () => void;
}

export default function Sidebar({ onOpenPalette }: SidebarProps) {
  const clearSession = useAuthStore((s) => s.clearSession);
  const email = useAuthStore((s) => s.email);
  const navigate = useNavigate();
  const qc = useQueryClient();

  function handleLogout() {
    qc.clear();
    clearSession();
    navigate("/", { replace: true });
  }

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:border-r md:border-cream-300/60 md:bg-cream-100/60 md:dark:border-ink-600/60 md:dark:bg-ink-700/60 md:p-4">
      <div className="mb-6 px-2">
        <Logo size={32} />
      </div>

      <button
        onClick={onOpenPalette}
        className="focus-ring mb-4 flex items-center gap-3 rounded-xl border border-cream-400/60 bg-cream-200/70 px-3 py-2.5 text-base text-ink-300 transition-colors hover:bg-cream-300/60 dark:border-ink-500/40 dark:bg-ink-600/60 dark:text-ink-200 dark:hover:bg-ink-500/40"
      >
        <span className="text-base">⌕</span>
        <span className="flex-1 text-left">Search & jump...</span>
        <span className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <nav className="flex-1 space-y-1">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium transition-colors",
                isActive
                  ? "bg-flame-500 text-white shadow-glow"
                  : "text-ink-400 hover:bg-cream-200 dark:text-ink-100 dark:hover:bg-ink-600",
              )
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 border-t border-cream-300/60 pt-4 dark:border-ink-600/60">
        {email ? (
          <div
            className="truncate px-3 text-sm text-ink-300 dark:text-ink-200"
            title={email}
          >
            {email}
          </div>
        ) : null}
        <NavLink
          to="/profile"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium text-ink-400 transition-colors hover:bg-cream-200 dark:text-ink-100 dark:hover:bg-ink-600"
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium text-ink-400 transition-colors hover:bg-cream-200 dark:text-ink-100 dark:hover:bg-ink-600"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
