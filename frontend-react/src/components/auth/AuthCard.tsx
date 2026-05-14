import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Sun,
  Calendar,
  Shield,
} from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Logo } from "../ui/Logo";
import { PasswordInput } from "../ui/PasswordInput";
import { PasswordStrengthMeter } from "../ui/PasswordStrengthMeter";
import { cn } from "../../lib/cn";
import { meetsRequirements } from "../../lib/password";
import * as authApi from "../../api/auth";
import { extractError } from "../../api/client";
import { useAuthStore } from "../../store/auth";
import { profileKey } from "../../hooks/useProfile";

type Tab = "login" | "register";

export default function AuthCard() {
  const location = useLocation();
  const initialTab: Tab =
    (location.state as { tab?: Tab } | null)?.tab === "register"
      ? "register"
      : "login";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const isRegister = tab === "register";

  const passwordsMatch = useMemo(
    () => !isRegister || (password && password === confirmPassword),
    [isRegister, password, confirmPassword],
  );

  const canSubmit = useMemo(() => {
    if (!email || !password) return false;
    if (!isRegister) return true;
    if (!name.trim()) return false;
    if (!meetsRequirements(password)) return false;
    if (password !== confirmPassword) return false;
    if (!acceptTerms) return false;
    return true;
  }, [email, password, name, confirmPassword, acceptTerms, isRegister]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      if (isRegister && !acceptTerms) {
        toast.error("Please accept the Terms to continue");
      } else {
        toast.error("Please fill in the required fields");
      }
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await authApi.register(email, password, name.trim() || undefined);
        toast.success("Account created — check your email for a confirmation code.");
        navigate("/confirm", { state: { email } });
      } else {
        const tokens = await authApi.login(email, password);
        setSession(tokens.token, email);
        // Force-refresh profile so greeting + onboarding see fresh data
        qc.invalidateQueries({ queryKey: profileKey });
        const from =
          (location.state as { from?: { pathname?: string } } | null)?.from
            ?.pathname ?? "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = extractError(
        err,
        isRegister ? "Registration failed" : "Login failed",
      );
      if (msg.toLowerCase().includes("confirm")) {
        toast.message("Please confirm your email", { description: msg });
        navigate("/confirm", { state: { email } });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  function switchTab(next: Tab) {
    setTab(next);
    // Reset register-only fields when leaving register to avoid stale validation
    if (next === "login") {
      setConfirmPassword("");
      setAcceptTerms(false);
    }
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-cream-100 dark:bg-ink-700 lg:grid-cols-[1.1fr_1fr]">
      <BrandPanel />

      <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md"
        >
          <div className="lg:hidden">
            <Link to="/" className="focus-ring inline-block rounded-md">
              <Logo size={36} />
            </Link>
          </div>

          <div className="mt-4 lg:mt-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-ink-300 dark:text-ink-200">
              {isRegister
                ? "Plan your day in 30 seconds — for free."
                : "Sign in to your personal day planner."}
            </p>
          </div>

          <div className="mt-6 flex rounded-xl bg-cream-200 p-1 dark:bg-ink-600">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-all",
                  t === tab
                    ? "bg-flame-500 text-white shadow-glow"
                    : "text-ink-300 hover:text-ink-400 dark:text-ink-200",
                )}
              >
                {t === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <OAuthButton provider="google" disabled />
            <OAuthButton provider="apple" disabled />
          </div>
          <p className="mt-1 text-center text-[0.65rem] text-ink-300 dark:text-ink-200">
            Social sign-in coming soon
          </p>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-cream-400/70 dark:bg-ink-500/40" />
            <span className="text-[0.65rem] uppercase tracking-wider text-ink-300 dark:text-ink-200">
              or with email
            </span>
            <div className="h-px flex-1 bg-cream-400/70 dark:bg-ink-500/40" />
          </div>

          <div className="space-y-3">
            {isRegister ? (
              <Field label="First name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  autoComplete="given-name"
                  autoFocus
                  required
                />
              </Field>
            ) : null}

            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus={!isRegister}
                required
              />
            </Field>

            <Field label="Password">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? "Create a password" : "Your password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                minLength={isRegister ? 8 : undefined}
                required
              />
              {isRegister ? <PasswordStrengthMeter value={password} /> : null}
            </Field>

            {isRegister ? (
              <Field label="Confirm password">
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  invalid={!!confirmPassword && !passwordsMatch}
                  required
                />
                {confirmPassword && !passwordsMatch ? (
                  <p className="mt-1 text-[0.7rem] text-red-500">
                    Passwords don't match
                  </p>
                ) : null}
              </Field>
            ) : null}
          </div>

          {isRegister ? (
            <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs text-ink-300 dark:text-ink-200">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer accent-flame-500"
              />
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-medium text-flame-500 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-medium text-flame-500 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          ) : null}

          <Button
            type="submit"
            loading={loading}
            disabled={!canSubmit}
            className="mt-5 w-full"
          >
            {isRegister ? "Create account" : "Sign in"}
            <ArrowRight size={16} className="ml-1.5" />
          </Button>

          <div className="mt-4 flex items-center justify-between text-xs">
            {!isRegister ? (
              <Link
                to="/forgot-password"
                className="text-ink-300 hover:text-flame-500 dark:text-ink-200"
              >
                Forgot password?
              </Link>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => switchTab(isRegister ? "login" : "register")}
              className="font-semibold text-flame-500 hover:underline"
            >
              {isRegister ? "Have an account? Sign in" : "New here? Create one"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-flame-500">
        {label}
      </label>
      {children}
    </div>
  );
}

interface OAuthButtonProps {
  provider: "google" | "apple";
  disabled?: boolean;
}

function OAuthButton({ provider, disabled }: OAuthButtonProps) {
  const isGoogle = provider === "google";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        // TODO: configure Cognito Hosted UI then redirect:
        //   window.location.href = `${HOSTED_UI_DOMAIN}/oauth2/authorize?identity_provider=${isGoogle ? "Google" : "SignInWithApple"}&client_id=...&response_type=code&scope=openid+email+profile&redirect_uri=...`;
        toast.message("Coming soon", {
          description: `${isGoogle ? "Google" : "Apple"} sign-in lands shortly.`,
        });
      }}
      className={cn(
        "focus-ring flex items-center justify-center gap-2 rounded-xl border border-cream-400/70 bg-cream-100 px-3 py-2.5 text-sm font-medium transition-colors",
        "hover:bg-cream-200 dark:border-ink-500/50 dark:bg-ink-600 dark:hover:bg-ink-500/40",
        disabled ? "cursor-not-allowed opacity-60" : "",
      )}
      aria-label={`Continue with ${isGoogle ? "Google" : "Apple"}`}
    >
      {isGoogle ? <GoogleIcon /> : <AppleIcon />}
      <span>Continue with {isGoogle ? "Google" : "Apple"}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M16.365 12.83c.012 1.962 1.755 2.611 1.775 2.62-.014.045-.279.954-.92 1.892-.553.808-1.127 1.612-2.031 1.629-.888.018-1.173-.524-2.187-.524-1.013 0-1.331.507-2.171.541-.871.034-1.535-.873-2.094-1.677-1.14-1.642-2.014-4.642-.842-6.67.583-1.006 1.626-1.644 2.756-1.66.852-.016 1.656.572 2.176.572.52 0 1.499-.706 2.529-.602.43.018 1.64.173 2.418 1.307-.062.039-1.445.842-1.43 2.572zM14.43 7.32c.46-.557.769-1.331.685-2.103-.662.027-1.464.44-1.94.997-.427.495-.8 1.286-.7 2.042.74.058 1.495-.378 1.955-.936z"
      />
    </svg>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-flame-500 via-flame-400 to-flame-600 lg:block">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,white_0,transparent_45%),radial-gradient(circle_at_80%_80%,white_0,transparent_40%)]" />
      <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14">
        <Link to="/" className="focus-ring inline-flex items-center gap-2 rounded-md">
          <svg viewBox="0 0 64 64" width={36} height={36} aria-hidden>
            <circle cx="32" cy="32" r="28" fill="white" />
            <path
              d="M22 32 L29 39 L43 25"
              fill="none"
              stroke="#eb9457"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight">
            DayFlow<span className="text-white/70">AI</span>
          </span>
        </Link>

        <div className="space-y-6">
          <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Your day, planned in a minute.
          </h2>
          <p className="max-w-sm text-sm text-white/80 xl:text-base">
            DayFlow blends your calendar, the weather, and your commute into a
            single calm briefing — every morning.
          </p>

          <ul className="space-y-3 pt-2">
            <Highlight icon={Sparkles} text="AI plans your day from plain English" />
            <Highlight icon={Sun} text="Weather + commute woven into every brief" />
            <Highlight icon={Calendar} text="Week & month views with one keystroke" />
            <Highlight icon={Shield} text="Private by default — your data, your rules" />
          </ul>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 size={16} />
            <span>Loved by early adopters</span>
          </div>
          <p className="mt-1.5 text-xs text-white/80">
            "It's the first morning routine that actually sticks. I open
            DayFlow before email." — Beta tester
          </p>
        </div>
      </div>
    </aside>
  );
}

interface HighlightProps {
  icon: typeof Sparkles;
  text: string;
}

function Highlight({ icon: Icon, text }: HighlightProps) {
  return (
    <li className="flex items-start gap-3 text-sm text-white/90">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Icon size={13} />
      </span>
      <span>{text}</span>
    </li>
  );
}
