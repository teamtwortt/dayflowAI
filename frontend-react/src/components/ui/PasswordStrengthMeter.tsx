import { Check, X } from "lucide-react";

import { evaluatePassword, PASSWORD_RULES } from "../../lib/password";
import { cn } from "../../lib/cn";

interface PasswordStrengthMeterProps {
  value: string;
  showRules?: boolean;
}

export function PasswordStrengthMeter({
  value,
  showRules = true,
}: PasswordStrengthMeterProps) {
  const result = evaluatePassword(value);
  const segments = 4;
  // map score 0..6 to filled segments 0..4
  const filled =
    result.level === "empty"
      ? 0
      : result.level === "weak"
        ? 1
        : result.level === "fair"
          ? 2
          : result.level === "good"
            ? 3
            : 4;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < filled ? result.color : "bg-cream-300 dark:bg-ink-500/40",
              )}
            />
          ))}
        </div>
        {result.label ? (
          <span className="w-12 text-right text-[0.7rem] font-medium text-ink-300 dark:text-ink-200">
            {result.label}
          </span>
        ) : null}
      </div>

      {showRules && value ? (
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {PASSWORD_RULES.map((rule) => {
            const ok = result.passing[rule.id];
            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-1.5 text-[0.7rem]",
                  ok
                    ? "text-green-600 dark:text-green-400"
                    : "text-ink-300 dark:text-ink-200",
                )}
              >
                {ok ? <Check size={12} /> : <X size={12} />}
                <span>{rule.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
