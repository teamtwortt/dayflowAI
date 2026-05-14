import { useMemo, useState } from "react";
import { MapPin, Bell, Clock, Sparkles, Phone, Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { useUpdatePreferences } from "../../hooks/useProfile";

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Australia/Sydney",
];

function detectTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || "America/New_York";
  } catch {
    return "America/New_York";
  }
}

const STEPS = 3;

const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState(() => detectTimezone());
  const [briefingTime, setBriefingTime] = useState("07:00");
  const [emailOn, setEmailOn] = useState(true);
  const [smsOn, setSmsOn] = useState(false);
  const [phone, setPhone] = useState("");
  const update = useUpdatePreferences();

  // If a timezone is in our presets, select it directly; otherwise show "Other (auto)"
  const timezoneOptions = useMemo(() => {
    const tz = timezone;
    if (TIMEZONES.includes(tz)) return TIMEZONES;
    return [tz, ...TIMEZONES];
  }, [timezone]);

  const phoneNormalized = normalizePhone(phone);
  const phoneValid = !smsOn || PHONE_REGEX.test(phoneNormalized);
  const canContinueStep1 = city.trim().length > 0;
  const canFinish = phoneValid;

  async function finish() {
    if (!canFinish) return;
    await update.mutateAsync({
      city: city.trim(),
      timezone,
      briefing_time: briefingTime,
      notifications_email: emailOn,
      notifications_sms: smsOn,
      phone: smsOn ? phoneNormalized : null,
    });
    localStorage.setItem("onboarded", "1");
    onClose();
  }

  function skip() {
    localStorage.setItem("onboarded", "1");
    onClose();
  }

  return (
    <Modal open={open} onClose={skip} hideClose size="md">
      <div className="text-center">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flame-500/15 text-flame-500">
                <Sparkles size={22} />
              </div>
              <h2 className="mt-3 text-xl font-bold">Welcome to DayFlow AI</h2>
              <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
                Let's tailor your daily briefing in 30 seconds. You can change
                everything later from Profile.
              </p>
            </>
          ) : step === 1 ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flame-500/15 text-flame-500">
                <MapPin size={22} />
              </div>
              <h2 className="mt-3 text-xl font-bold">Where are you?</h2>
              <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
                We use this for weather, commute, and timing.
              </p>
              <div className="mt-5 space-y-3 text-left">
                <div>
                  <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
                    City
                  </label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Brooklyn, NY"
                    autoFocus
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
                      Time zone
                    </label>
                    <span className="inline-flex items-center gap-1 text-[0.65rem] text-ink-300 dark:text-ink-200">
                      <Globe2 size={10} /> Auto-detected
                    </span>
                  </div>
                  <Select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    {timezoneOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flame-500/15 text-flame-500">
                <Clock size={22} />
              </div>
              <h2 className="mt-3 text-xl font-bold">When should we ping you?</h2>
              <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
                Your morning briefing arrives at this time.
              </p>
              <div className="mt-5 space-y-3 text-left">
                <div>
                  <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
                    Briefing time
                  </label>
                  <Input
                    type="time"
                    value={briefingTime}
                    onChange={(e) => setBriefingTime(e.target.value)}
                  />
                </div>
                <ToggleOption
                  label="Email me my briefing"
                  Icon={Bell}
                  checked={emailOn}
                  onChange={setEmailOn}
                />
                <ToggleOption
                  label="SMS me weather alerts"
                  Icon={Bell}
                  checked={smsOn}
                  onChange={setSmsOn}
                />

                <AnimatePresence initial={false}>
                  {smsOn ? (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1">
                        <label className="mb-1 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
                          <Phone size={11} /> Phone number
                        </label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555 123 4567"
                          autoComplete="tel"
                          invalid={!!phone && !phoneValid}
                        />
                        <p className="mt-1 text-[0.65rem] text-ink-300 dark:text-ink-200">
                          Include country code. We only text for severe weather.
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: STEPS }).map((_, i) => (
              <span
                key={i}
                className={
                  "h-1.5 rounded-full transition-all " +
                  (i === step
                    ? "w-6 bg-flame-500"
                    : i < step
                      ? "w-1.5 bg-flame-500/50"
                      : "w-1.5 bg-cream-400 dark:bg-ink-500")
                }
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={skip}
              className="text-xs text-ink-300 hover:text-flame-500 dark:text-ink-200"
            >
              Skip for now
            </button>
            <AnimatePresence mode="wait">
              {step < STEPS - 1 ? (
                <Button
                  key="next"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 1 && !canContinueStep1}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  key="finish"
                  onClick={finish}
                  loading={update.isPending}
                  disabled={!canFinish}
                >
                  Done
                </Button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface ToggleOptionProps {
  label: string;
  Icon: typeof Bell;
  checked: boolean;
  onChange: (next: boolean) => void;
}

function ToggleOption({ label, Icon, checked, onChange }: ToggleOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-cream-400/60 bg-cream-100 px-3 py-2.5 text-left transition-colors hover:bg-cream-300/40 dark:border-ink-500/40 dark:bg-ink-700 dark:hover:bg-ink-500/40"
    >
      <div className="flex items-center gap-2.5">
        <Icon size={16} className="text-flame-500" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span
        className={
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors " +
          (checked ? "bg-flame-500" : "bg-cream-400 dark:bg-ink-500")
        }
      >
        <span
          className={
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform " +
            (checked ? "translate-x-4" : "translate-x-0.5")
          }
        />
      </span>
    </button>
  );
}
