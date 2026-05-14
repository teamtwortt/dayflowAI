import { cn } from "../../lib/cn";

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-cream-400/70 bg-cream-100 px-1.5 font-mono text-[0.65rem] font-semibold text-ink-400 shadow-sm dark:border-ink-500/40 dark:bg-ink-700 dark:text-ink-100",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
