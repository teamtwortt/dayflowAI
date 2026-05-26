import { cn } from "../../lib/cn";

interface ProgressRingProps {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  label?: string;
  labelClassName?: string;
}

export function ProgressRing({
  value,
  size = 48,
  stroke = 3,
  label,
  labelClassName,
}: ProgressRingProps) {
  const safe = Math.max(0, Math.min(1, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safe);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(247,247,245,0.2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#c5d0c0"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <span
        className={cn(
          "absolute text-[0.72rem] font-semibold text-flame-500",
          labelClassName,
        )}
      >
        {label ?? `${Math.round(safe * 100)}%`}
      </span>
    </div>
  );
}
