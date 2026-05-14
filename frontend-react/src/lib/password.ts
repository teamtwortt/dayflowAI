export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "len", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "upper", label: "An uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "A lowercase letter", test: (v) => /[a-z]/.test(v) },
  { id: "num", label: "A number", test: (v) => /\d/.test(v) },
  {
    id: "sym",
    label: "A symbol (!@#$ etc.)",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

export interface StrengthResult {
  level: StrengthLevel;
  score: number; // 0-5
  passing: Record<string, boolean>;
  label: string;
  color: string; // tailwind background class for the meter
}

export function evaluatePassword(value: string): StrengthResult {
  const passing: Record<string, boolean> = {};
  let score = 0;
  for (const rule of PASSWORD_RULES) {
    const ok = rule.test(value);
    passing[rule.id] = ok;
    if (ok) score += 1;
  }
  // Bonus point for length >= 12
  if (value.length >= 12) score += 1;
  if (!value) {
    return {
      level: "empty",
      score: 0,
      passing,
      label: "",
      color: "bg-cream-300 dark:bg-ink-500/40",
    };
  }
  if (score <= 2) return strength("weak", score, passing, "Weak", "bg-red-400");
  if (score <= 3) return strength("fair", score, passing, "Fair", "bg-yellow-400");
  if (score <= 4) return strength("good", score, passing, "Good", "bg-flame-400");
  return strength("strong", score, passing, "Strong", "bg-green-500");
}

function strength(
  level: StrengthLevel,
  score: number,
  passing: Record<string, boolean>,
  label: string,
  color: string,
): StrengthResult {
  return { level, score, passing, label, color };
}

export function meetsRequirements(value: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(value));
}
