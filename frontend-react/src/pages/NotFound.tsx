import { Link } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Logo size={40} />
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-300 dark:text-ink-200">
        The page you're looking for doesn't exist — but your day still has a
        plan.
      </p>
      <Link to="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
