import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarCheck,
  CloudSun,
  GraduationCap,
  HeartHandshake,
  Lock,
  MessageCircle,
  Moon,
  Send,
  Sparkles,
  Sun,
  Type,
  Zap,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";
import { useAuthStore } from "../store/auth";
import { useTheme } from "../hooks/useTheme";

const features = [
  {
    Icon: CalendarCheck,
    title: "Smart event management",
    body: "Create, categorize, and edit events with a calm interface designed for speed and clarity.",
  },
  {
    Icon: Sparkles,
    title: "AI-powered scheduling",
    body: 'Type "Lunch with Maya tomorrow at 1pm" and DayFlow parses it into a structured event.',
    accent: true,
  },
  {
    Icon: CloudSun,
    title: "Weather-aware advice",
    body: "Umbrella before rain. Jacket before a cold front. Context the moment you need it.",
  },
  {
    Icon: Bell,
    title: "Multi-channel reminders",
    body: "SMS and email briefings meet you where you already are — no need to keep the app open.",
  },
  {
    Icon: Lock,
    title: "Secure by default",
    body: "Cognito auth, encrypted storage, AWS-grade identity. Your data, your control.",
  },
  {
    Icon: Zap,
    title: "Serverless, instant scale",
    body: "Zero to thousands of users with no servers to manage. Pay only for what you use.",
  },
];

const steps = [
  {
    Icon: Type,
    badge: "01",
    title: "Add events in plain English",
    body: "Type or speak naturally — “Standup every weekday at 9am” — and DayFlow understands you.",
  },
  {
    Icon: Sparkles,
    badge: "02",
    title: "Get your morning briefing",
    body: "Each morning, your schedule + weather + commute arrive as a single, readable summary.",
  },
  {
    Icon: MessageCircle,
    badge: "03",
    title: "Stay ahead all day",
    body: "Context-aware nudges meet you on email, SMS, or push — whenever it matters.",
  },
];

const personas = [
  {
    Icon: Briefcase,
    title: "Working professionals",
    body: "Back-to-back meetings, cross-team deadlines, and a commute that doesn't know it's raining. DayFlow connects them.",
    tint: "from-flame-400/15 to-flame-500/10",
  },
  {
    Icon: GraduationCap,
    title: "College students",
    body: "Classes, study blocks, part-time work, and social plans — folded into one morning view you can actually parse.",
    tint: "from-blue-400/15 to-blue-500/10",
  },
  {
    Icon: HeartHandshake,
    title: "Busy parents",
    body: "School drop-offs, family appointments, and errands — coordinated with weather and travel time, automatically.",
    tint: "from-green-400/15 to-green-500/10",
  },
];

const awsLogos = [
  "Cognito",
  "API Gateway",
  "Lambda",
  "DynamoDB",
  "EventBridge",
  "SNS / SES",
  "CloudWatch",
  "X-Ray",
  "Bedrock",
];

export default function Landing() {
  const token = useAuthStore((s) => s.token);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream-100 text-ink-700 dark:bg-ink-700 dark:text-ink-50">
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Logo size={32} />
        <nav className="hidden items-center gap-7 text-sm text-ink-400 dark:text-ink-100 md:flex">
          <a
            href="#how"
            className="transition-colors hover:text-flame-500"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            How it works
          </a>
          <a
            href="#features"
            className="transition-colors hover:text-flame-500"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </a>
          <a
            href="#who"
            className="transition-colors hover:text-flame-500"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("who")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Who it's for
          </a>
          <a
            href="#aws"
            className="transition-colors hover:text-flame-500"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("aws")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Built on AWS
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-cream-400/60 text-ink-400 transition-colors hover:bg-cream-200 dark:border-ink-500/60 dark:text-ink-100 dark:hover:bg-ink-600"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/login" state={{ tab: "register" }}>
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 left-1/3 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-flame-300/25 blur-3xl dark:bg-flame-500/10" />
          <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-flame-400/20 blur-3xl dark:bg-flame-500/10" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-14 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-16">
          {/* LEFT: copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-cream-400/70 bg-cream-200/80 px-3 py-1 text-xs font-medium text-ink-400 backdrop-blur dark:border-ink-500/50 dark:bg-ink-600/60 dark:text-ink-100"
            >
              <Sparkles size={12} className="text-flame-500" />
              Serverless personal productivity assistant
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              Your day,{" "}
              <span className="bg-gradient-to-r from-flame-400 to-flame-600 bg-clip-text text-transparent">
                intelligently orchestrated.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-5 max-w-xl text-base text-ink-300 dark:text-ink-200 sm:text-lg lg:mx-0 lg:text-xl"
            >
              DayFlow AI merges your calendar with weather, traffic, and a real
              AI assistant — so you stop juggling apps and start owning your
              day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => navigate("/login", { state: { tab: "register" } })}
              >
                Get your first briefing
                <ArrowRight size={18} />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("how")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See how it works
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 text-xs text-ink-300 dark:text-ink-200"
            >
              No credit card · Free forever for personal use · 100% serverless
              on AWS
            </motion.p>
          </div>

          {/* RIGHT: desktop card + phone mock */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <DesktopMock />
            <div className="absolute -bottom-10 -right-2 hidden w-44 rotate-3 sm:block sm:w-52 md:-right-6 md:w-56 lg:-bottom-12 lg:-right-4">
              <PhoneMock />
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative bg-cream-200/40 py-20 dark:bg-ink-600/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame-500">
              How it works
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Three steps to a calmer day.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ Icon, badge, title, body }, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="surface-elevated relative rounded-3xl p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500/15 text-flame-500">
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-xs font-semibold tracking-wider text-flame-500">
                    {badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-300 dark:text-ink-200">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Inline AI demo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="surface-elevated mx-auto mt-12 max-w-3xl rounded-3xl p-2 shadow-soft"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-cream-100 px-4 py-3 dark:bg-ink-700">
              <Sparkles size={16} className="text-flame-500" />
              <span className="flex-1 text-sm text-ink-700 dark:text-ink-50">
                Lunch with Maya tomorrow at 1pm at Founding Farmers
              </span>
              <span className="flex h-8 items-center justify-center rounded-lg bg-flame-500 px-3 text-xs font-semibold text-white">
                <Send size={12} className="mr-1.5" />
                Add
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 px-4 pb-3 pt-2 text-xs text-ink-300 dark:text-ink-200">
              <span>→</span>
              <span className="rounded-full bg-flame-500/15 px-2 py-0.5 font-medium text-flame-600">
                title: Lunch with Maya
              </span>
              <span className="rounded-full bg-flame-500/15 px-2 py-0.5 font-medium text-flame-600">
                when: tomorrow 1:00pm
              </span>
              <span className="rounded-full bg-flame-500/15 px-2 py-0.5 font-medium text-flame-600">
                category: social
              </span>
              <span className="rounded-full bg-flame-500/15 px-2 py-0.5 font-medium text-flame-600">
                location: Founding Farmers
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame-500">
            What it does
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need, nothing you don't.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-ink-300 dark:text-ink-200 lg:text-base">
            DayFlow AI unifies your calendar, weather, and reminders into one
            calm experience — designed to reduce cognitive load, not add to it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, body, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={
                "surface-elevated rounded-2xl p-6 " +
                (accent
                  ? "border-flame-500/40 bg-gradient-to-br from-flame-500/10 to-transparent dark:from-flame-500/15"
                  : "")
              }
            >
              <div
                className={
                  "mb-4 flex h-11 w-11 items-center justify-center rounded-xl " +
                  (accent
                    ? "bg-flame-500 text-white"
                    : "bg-flame-500/15 text-flame-500")
                }
              >
                <Icon size={20} />
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300 dark:text-ink-200">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PERSONAS */}
      <section id="who" className="relative bg-cream-200/40 py-20 dark:bg-ink-600/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame-500">
              Who it's for
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Built for the way you actually plan.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {personas.map(({ Icon, title, body, tint }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={
                  "surface-elevated relative overflow-hidden rounded-3xl p-6"
                }
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${tint}`}
                />
                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-ink-700 backdrop-blur dark:bg-ink-700/70 dark:text-ink-50">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400 dark:text-ink-100">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AWS */}
      <section id="aws" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="surface-elevated rounded-3xl p-8 lg:p-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame-500">
              Built on AWS
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Production-grade serverless architecture.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-300 dark:text-ink-200 lg:text-base">
              Nine AWS services working together — for security, scale, and
              zero idle cost.
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
            {awsLogos.map((name) => (
              <span
                key={name}
                className="rounded-full border border-cream-400/60 bg-cream-100 px-3 py-1.5 text-xs font-medium text-ink-400 dark:border-ink-500/40 dark:bg-ink-700 dark:text-ink-100"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value="100%" label="Serverless" />
            <Stat value="<2s" label="API response" />
            <Stat value="99.9%" label="Uptime target" />
            <Stat value="$0" label="Idle cost" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ready for a calmer day?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink-300 dark:text-ink-200 lg:text-base">
          Join in seconds. Your first briefing arrives tomorrow morning.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate("/login", { state: { tab: "register" } })}
          >
            Create your account
            <ArrowRight size={18} />
          </Button>
          <Link to="/login">
            <Button variant="ghost" size="lg">
              I already have one
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-cream-300/60 px-6 py-10 dark:border-ink-600/60 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo size={24} />
          <p className="text-xs text-ink-300 dark:text-ink-200">
            DayFlow AI · AWS Re/Start · Group 2 · 2026
          </p>
          <div className="flex gap-4 text-xs text-ink-300 dark:text-ink-200">
            <a href="#features" className="hover:text-flame-500">
              Features
            </a>
            <a href="#aws" className="hover:text-flame-500">
              AWS
            </a>
            <Link to="/login" className="hover:text-flame-500">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold leading-none text-flame-500 lg:text-5xl">
        {value}
      </div>
      <div className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-ink-300 dark:text-ink-200">
        {label}
      </div>
    </div>
  );
}

function DesktopMock() {
  return (
    <div className="surface-elevated rounded-3xl p-4 shadow-soft sm:p-5">
      {/* Browser chrome */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="rounded-full bg-cream-100 px-3 py-1 text-[0.65rem] text-ink-300 dark:bg-ink-700 dark:text-ink-200">
          dayflowai.app/dashboard
        </div>
        <Logo size={22} showWord={false} />
      </div>

      {/* Greeting + AI quick-add */}
      <div className="text-left">
        <div className="text-lg font-bold">Good morning, Darrenae!</div>
        <div className="text-xs text-ink-300 dark:text-ink-200">
          You've got 3 events and clear skies.
        </div>
      </div>

      {/* AI input */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-cream-100 px-3 py-2.5 dark:bg-ink-700">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-flame-500/15 text-flame-500">
          <Sparkles size={12} />
        </div>
        <div className="flex-1 truncate text-xs text-ink-300 dark:text-ink-200">
          Coffee with Sam Friday at 9am at Compass...
        </div>
        <span className="flex h-6 items-center rounded-md bg-flame-500 px-2 text-[0.65rem] font-semibold text-white">
          Add
        </span>
      </div>

      {/* Focus card */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-ink-500 px-4 py-3 text-ink-50 dark:bg-cream-400 dark:text-ink-700">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-flame-500/25">
            <Sparkles size={13} className="text-flame-300" />
          </div>
          <div className="text-left">
            <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-flame-300">
              Today's focus
            </div>
            <div className="text-sm font-semibold">Team standup</div>
          </div>
        </div>
        <div className="text-xs font-semibold text-flame-300">9:00 AM</div>
      </div>

      {/* Events */}
      <div className="mt-3 space-y-1.5 text-left">
        {[
          { time: "10:30", title: "Design review", done: true },
          { time: "12:00", title: "Lunch with Maya", done: false },
          { time: "16:00", title: "Gym session", done: false },
        ].map((e) => (
          <div
            key={e.title}
            className="flex items-center gap-3 rounded-lg bg-cream-100 px-3 py-2 dark:bg-ink-700"
          >
            <div className="w-12 text-[0.65rem] text-ink-300 dark:text-ink-200">
              {e.time}
            </div>
            <div
              className={
                "flex-1 text-xs font-medium " +
                (e.done ? "text-ink-300 line-through dark:text-ink-200" : "")
              }
            >
              {e.title}
            </div>
            <span
              className={
                "h-4 w-4 rounded-full border-2 " +
                (e.done
                  ? "border-flame-500 bg-flame-500"
                  : "border-cream-500 dark:border-ink-400")
              }
            />
          </div>
        ))}
      </div>

      {/* Weather */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-cream-100 px-4 py-3 dark:bg-ink-700">
        <div className="flex items-center gap-3">
          <CloudSun size={22} className="text-flame-500" />
          <div className="text-left">
            <div className="text-base font-bold">72°F</div>
            <div className="text-[0.65rem] text-ink-300 dark:text-ink-200">
              Partly cloudy · Washington DC
            </div>
          </div>
        </div>
        <div className="text-[0.65rem] font-medium text-flame-500">
          Looks great today
        </div>
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="rounded-[2rem] border-[6px] border-ink-700 bg-cream-100 p-2.5 shadow-glow-lg dark:border-ink-800 dark:bg-ink-700">
      <div className="overflow-hidden rounded-[1.4rem]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-3 py-1 text-[0.55rem] text-ink-300 dark:text-ink-200">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        {/* App content */}
        <div className="px-3 pb-3">
          <Logo size={18} />
          <div className="mt-2 text-[0.65rem] font-bold">Today</div>
          <div className="mt-1 flex items-center justify-between rounded-lg bg-ink-500 px-2 py-1.5 text-ink-50 dark:bg-cream-400 dark:text-ink-700">
            <div className="text-[0.6rem] font-semibold">Team standup</div>
            <div className="text-[0.55rem] text-flame-300">9:00</div>
          </div>
          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[0.6rem]">
              <span className="w-7 text-ink-300 dark:text-ink-200">10:30</span>
              <span className="flex-1 truncate">Design review</span>
              <span className="h-2.5 w-2.5 rounded-full border border-cream-500 dark:border-ink-400" />
            </div>
            <div className="flex items-center gap-1.5 text-[0.6rem]">
              <span className="w-7 text-ink-300 dark:text-ink-200">12:00</span>
              <span className="flex-1 truncate">Lunch with Maya</span>
              <span className="h-2.5 w-2.5 rounded-full border border-cream-500 dark:border-ink-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-cream-100 px-2 py-1.5 dark:bg-ink-700">
            <div className="flex items-center gap-1.5">
              <CloudSun size={12} className="text-flame-500" />
              <div className="text-[0.65rem] font-bold">72°F</div>
            </div>
            <div className="text-[0.55rem] text-flame-500">Looks great</div>
          </div>
        </div>
      </div>
    </div>
  );
}
