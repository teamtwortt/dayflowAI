import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-cream-100 dark:bg-ink-700",
          "px-4 py-3 text-sm text-ink-700 dark:text-ink-50",
          "placeholder:text-ink-200 dark:placeholder:text-ink-300",
          "transition-colors outline-none",
          invalid
            ? "border-red-400 focus:border-red-500"
            : "border-cream-500/70 dark:border-ink-500 focus:border-flame-500",
          "focus-ring",
          className,
        )}
        {...rest}
      />
    );
  },
);
Input.displayName = "Input";
