import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...rest }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-none rounded-xl border bg-cream-100 dark:bg-ink-700",
        "px-4 py-3 text-sm text-ink-700 dark:text-ink-50",
        "placeholder:text-ink-200 dark:placeholder:text-ink-300",
        "border-cream-500/70 dark:border-ink-500",
        "focus:border-flame-500 focus-ring outline-none transition-colors",
        className,
      )}
      {...rest}
    />
  ),
);
Textarea.displayName = "Textarea";
