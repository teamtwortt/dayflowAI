import { Bell, Moon, Search, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Logo } from "../ui/Logo";
import { useTheme } from "../../hooks/useTheme";

interface TopNavProps {
  onOpenPalette: () => void;
}

export default function TopNav({ onOpenPalette }: TopNavProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-cream-300/60 bg-cream-100/85 px-4 py-3 backdrop-blur-md dark:border-ink-600/60 dark:bg-ink-700/85 sm:px-6">
      <Link to="/dashboard" className="focus-ring rounded-md md:invisible">
        <Logo />
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPalette}
          aria-label="Search"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-cream-400/60 text-ink-400 transition-colors hover:bg-cream-200 dark:border-ink-500/60 dark:text-ink-100 dark:hover:bg-ink-600"
        >
          <Search size={16} />
        </button>
        <button
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-cream-400/60 text-ink-400 transition-colors hover:bg-cream-200 dark:border-ink-500/60 dark:text-ink-100 dark:hover:bg-ink-600"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          aria-label="Notifications"
          className="focus-ring hidden h-9 w-9 items-center justify-center rounded-full border border-cream-400/60 text-ink-400 transition-colors hover:bg-cream-200 dark:border-ink-500/60 dark:text-ink-100 dark:hover:bg-ink-600 sm:flex"
        >
          <Bell size={16} />
        </button>
        <Link
          to="/profile"
          aria-label="Profile"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-cream-400/60 text-ink-400 transition-colors hover:bg-cream-200 dark:border-ink-500/60 dark:text-ink-100 dark:hover:bg-ink-600"
        >
          <User size={16} />
        </Link>
      </div>
    </header>
  );
}
