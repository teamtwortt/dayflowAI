import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-xl border bg-cream-100 dark:bg-ink-700",
            "px-4 py-3 pr-10 text-sm text-ink-700 dark:text-ink-50",
            "border-cream-500/70 dark:border-ink-500",
            "focus:border-flame-500 focus-ring outline-none transition-colors",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 dark:text-ink-200"
        />
      </div>
    );
  },
);
Select.displayName = "Select";
