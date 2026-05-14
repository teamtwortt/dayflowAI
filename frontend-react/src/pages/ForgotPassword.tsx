import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Logo } from "../components/ui/Logo";
import { forgotPassword, resetPassword } from "../api/auth";
import { extractError } from "../api/client";

export default function ForgotPassword() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Reset code sent — check your email");
      setStep("reset");
    } catch (err) {
      toast.error(extractError(err, "Could not start reset"));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!code || !newPassword) return;
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      toast.success("Password reset! Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(extractError(err, "Reset failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 dark:bg-ink-700">
      <form
        onSubmit={step === "request" ? handleRequest : handleReset}
        className="w-full max-w-sm rounded-3xl border border-cream-400/60 bg-cream-200 p-7 shadow-soft dark:border-ink-500/40 dark:bg-ink-600"
      >
        <Link to="/" className="focus-ring inline-block rounded-md">
          <Logo size={36} />
        </Link>
        <h1 className="mt-4 text-xl font-bold">
          {step === "request" ? "Reset your password" : "Enter your reset code"}
        </h1>
        <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
          {step === "request"
            ? "We'll email you a verification code to reset your password."
            : `Enter the code we sent to ${email} and choose a new password.`}
        </p>

        <div className="mt-6 space-y-3">
          {step === "request" ? (
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              autoFocus
            />
          ) : (
            <>
              <Input
                placeholder="Verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
              />
              <Input
                type="password"
                placeholder="New password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </>
          )}
        </div>

        <Button type="submit" loading={loading} className="mt-5 w-full">
          {step === "request" ? "Send reset code" : "Reset password"}
        </Button>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link
            to="/login"
            className="text-ink-300 hover:text-flame-500 dark:text-ink-200"
          >
            Back to sign in
          </Link>
          {step === "reset" ? (
            <button
              type="button"
              onClick={() => setStep("request")}
              className="text-flame-500 hover:underline"
            >
              Resend code
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
