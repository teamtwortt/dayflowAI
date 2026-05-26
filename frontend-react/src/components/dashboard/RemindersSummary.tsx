import { Bell, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { formatBriefingTime } from "../../lib/format";
import type { UserPreferences } from "../../api/types";

interface RemindersSummaryProps {
  preferences: UserPreferences | undefined;
  loading: boolean;
}

function StatusRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Bell;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flame-500/10 text-flame-500">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-flame-500">
          {label}
        </div>
        <div className="text-sm font-medium text-ink-700 dark:text-ink-50">{value}</div>
      </div>
    </div>
  );
}

export function RemindersSummary({ preferences, loading }: RemindersSummaryProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="space-y-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </Card>
    );
  }

  const briefingTime = preferences?.briefing_time ?? "07:00";
  const emailOn = preferences?.notifications_email ?? true;
  const smsOn = preferences?.notifications_sms ?? false;
  const phone = preferences?.phone?.trim();

  return (
    <Card className="space-y-4">
      <p className="text-sm text-ink-300 dark:text-ink-200">
        Morning briefing and alert channels configured in your profile.
      </p>

      <StatusRow
        icon={Bell}
        label="Daily briefing"
        value={`${formatBriefingTime(briefingTime)} local time`}
      />
      <StatusRow
        icon={Mail}
        label="Email briefings"
        value={emailOn ? "On" : "Off"}
      />
      <StatusRow
        icon={MessageSquare}
        label="SMS reminders"
        value={
          smsOn
            ? phone
              ? `On · ${phone}`
              : "On · add a phone number in Profile"
            : "Off"
        }
      />

      <Button className="w-full sm:w-auto" onClick={() => navigate("/profile")}>
        Manage in Profile
      </Button>
    </Card>
  );
}
