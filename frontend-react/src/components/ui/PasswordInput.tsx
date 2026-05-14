import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "../../lib/cn";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, invalid, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-xl border bg-cream-100 dark:bg-ink-700",
            "px-4 py-3 pr-10 text-sm text-ink-700 dark:text-ink-50",
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
        <button
          type="button"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
          className="focus-ring absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-300 hover:text-flame-500 dark:text-ink-200"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
