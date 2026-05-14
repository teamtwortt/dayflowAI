import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("UI error boundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <Logo size={40} />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-flame-500/15 text-flame-500">
            <AlertTriangle size={26} />
          </div>
          <h1 className="text-2xl font-bold">Something went sideways</h1>
          <p className="max-w-sm text-sm text-ink-300 dark:text-ink-200">
            DayFlow AI hit an unexpected error. Refreshing usually does the
            trick — your data is safe.
          </p>
          <pre className="max-w-md overflow-x-auto rounded-xl bg-cream-200 p-3 text-left text-xs dark:bg-ink-600">
            {this.state.error.message}
          </pre>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw size={14} />
            Reload
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
