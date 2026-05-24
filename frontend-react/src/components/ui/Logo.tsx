import { cn } from "../../lib/cn";

interface LogoProps {
  size?: number;
  className?: string;
  showWord?: boolean;
}

export function Logo({ size = 32, className, showWord = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 64 64" width={size} height={size}>
          <defs>
            <linearGradient id="logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b9bdc7" />
              <stop offset="100%" stopColor="#f7f7f5" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#logo-g)" />
          <path
            d="M22 32 L29 39 L43 25"
            fill="none"
            stroke="#202124"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showWord ? (
        <div className="text-base font-bold tracking-tight text-ink-700 dark:text-ink-50">
          DayFlow
          <span className="text-flame-500">AI</span>
        </div>
      ) : null}
    </div>
  );
}
