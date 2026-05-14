import { CalendarDays, Home, Plus, Sparkles, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { cn } from "../../lib/cn";

const leftItems = [
  { to: "/dashboard", label: "Home", Icon: Home },
  { to: "/plan", label: "Plan", Icon: CalendarDays },
];

const rightItems = [
  { to: "/assistant", label: "Assistant", Icon: Sparkles },
  { to: "/profile", label: "Profile", Icon: User },
];

interface BottomNavProps {
  onFabClick: () => void;
}

export default function BottomNav({ onFabClick }: BottomNavProps) {
  const navigate = useNavigate();

  function handleFab() {
    if (window.location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
    onFabClick();
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-cream-300/60 bg-cream-100/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 backdrop-blur-md dark:border-ink-600/60 dark:bg-ink-700/95 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {leftItems.map(({ to, label, Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} />
        ))}

        <button
          aria-label="Add event"
          onClick={handleFab}
          className="-mt-6 flex items-center justify-center rounded-full bg-flame-500 text-white shadow-glow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ height: 52, width: 52 }}
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>

        {rightItems.map(({ to, label, Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} />
        ))}
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  label: string;
  Icon: typeof Home;
}

function NavItem({ to, label, Icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex min-w-[50px] flex-col items-center gap-1 py-1 text-[0.65rem] font-medium transition-colors",
          isActive
            ? "text-flame-500"
            : "text-ink-300 dark:text-ink-200 hover:text-ink-400 dark:hover:text-ink-100",
        )
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}
