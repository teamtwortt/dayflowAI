import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { useProfile, useUpdatePreferences } from "../hooks/useProfile";
import { useAuthStore } from "../store/auth";

export default function Profile() {
  const profile = useProfile();
  const update = useUpdatePreferences();
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [briefingTime, setBriefingTime] = useState("07:00");
  const [emailOn, setEmailOn] = useState(true);
  const [smsOn, setSmsOn] = useState(false);

  useEffect(() => {
    if (profile.data) {
      const p = profile.data.preferences;
      setCity(p.city || "");
      setPhone(p.phone || "");
      setBriefingTime(p.briefing_time || "07:00");
      setEmailOn(!!p.notifications_email);
      setSmsOn(!!p.notifications_sms);
    }
  }, [profile.data]);

  function handleLogout() {
    qc.clear();
    clearSession();
    navigate("/", { replace: true });
  }

  function handleSave() {
    update.mutate({
      city,
      phone: phone || null,
      briefing_time: briefingTime,
      notifications_email: emailOn,
      notifications_sms: smsOn,
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
          Tailor DayFlow AI to fit your day.
        </p>
      </motion.div>

      <Card className="mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flame-500 text-lg font-semibold text-white">
            {(profile.data?.email || "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            {profile.isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <div className="truncate text-sm font-semibold">
                {profile.data?.email}
              </div>
            )}
            <div className="text-xs text-ink-300 dark:text-ink-200">
              DayFlow AI account
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-4 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-flame-500">
            City for weather + briefing
          </label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Washington DC"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-flame-500">
            Daily briefing time
          </label>
          <Input
            type="time"
            value={briefingTime}
            onChange={(e) => setBriefingTime(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-flame-500">
            Phone (for SMS notifications)
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+15555550100"
          />
        </div>
      </Card>

      <Card className="mb-4 space-y-3">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <Toggle
          label="Email briefings"
          description="Daily agenda delivered to your inbox"
          checked={emailOn}
          onChange={setEmailOn}
        />
        <Toggle
          label="SMS reminders"
          description="Text alerts for urgent or weather-sensitive events"
          checked={smsOn}
          onChange={setSmsOn}
        />
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button onClick={handleSave} loading={update.isPending}>
          Save changes
        </Button>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut size={16} />
          Log out
        </Button>
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-2 text-left transition-colors hover:bg-cream-300/50 dark:hover:bg-ink-500/40"
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        {description ? (
          <div className="text-xs text-ink-300 dark:text-ink-200">
            {description}
          </div>
        ) : null}
      </div>
      <span
        className={
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " +
          (checked ? "bg-flame-500" : "bg-cream-400 dark:bg-ink-500")
        }
        role="switch"
        aria-checked={checked}
      >
        <span
          className={
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform " +
            (checked ? "translate-x-5" : "translate-x-0.5")
          }
        />
      </span>
    </button>
  );
}
