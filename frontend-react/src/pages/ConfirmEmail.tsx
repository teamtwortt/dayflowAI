import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Logo } from "../components/ui/Logo";
import { confirm, resendConfirmation } from "../api/auth";
import { extractError } from "../api/client";

export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await confirm(email, code);
      toast.success("Email confirmed — please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(extractError(err, "Confirmation failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await resendConfirmation(email);
      toast.success("Confirmation code resent");
    } catch (err) {
      toast.error(extractError(err, "Could not resend code"));
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 dark:bg-ink-700">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-cream-400/60 bg-cream-200 p-7 shadow-soft dark:border-ink-500/40 dark:bg-ink-600"
      >
        <Link to="/" className="focus-ring inline-block rounded-md">
          <Logo size={36} />
        </Link>
        <h1 className="mt-4 text-xl font-bold">Confirm your email</h1>
        <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
          We sent a verification code to your inbox. Enter it below to activate
          your DayFlow AI account.
        </p>

        <div className="mt-6 space-y-3">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            autoFocus
          />
        </div>

        <Button type="submit" loading={loading} className="mt-5 w-full">
          Confirm
        </Button>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link
            to="/login"
            className="text-ink-300 hover:text-flame-500 dark:text-ink-200"
          >
            Back to sign in
          </Link>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="text-flame-500 hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
