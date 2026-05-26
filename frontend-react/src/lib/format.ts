import { format, isToday, isTomorrow, parseISO } from "date-fns";

export function formatTime(iso: string): string {
  try {
    return format(parseISO(iso), "h:mm a");
  } catch {
    return iso;
  }
}

export function formatDateLabel(iso: string): string {
  try {
    const d = parseISO(iso);
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "EEE, MMM d");
  } catch {
    return iso;
  }
}

export function formatFullDate(iso: string): string {
  try {
    return format(parseISO(iso), "EEEE, MMMM d");
  } catch {
    return iso;
  }
}

export function startsWithToday(iso: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return iso.startsWith(today);
}

/** Profile `briefing_time` is stored as 24h "HH:mm". */
export function formatBriefingTime(time24: string): string {
  const [hStr, mStr = "00"] = time24.split(":");
  const h = Number.parseInt(hStr ?? "7", 10);
  if (Number.isNaN(h)) return time24;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
}

export function getGreeting(): { title: string; sub: string } {
  const h = new Date().getHours();
  if (h < 12) {
    return {
      title: "Good morning",
      sub: "You've got a productive day ahead.",
    };
  }
  if (h < 17) {
    return { title: "Good afternoon", sub: "Keep up the momentum." };
  }
  return { title: "Good evening", sub: "Let's wrap up strong." };
}
