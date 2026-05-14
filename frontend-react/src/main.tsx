import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import App from "./App";
import { registerServiceWorker } from "./lib/pwa";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const stored = localStorage.getItem("theme");
const prefersDark =
  stored === "dark" ||
  (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
if (prefersDark) document.body.classList.add("dark");

registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "!bg-cream-200 dark:!bg-ink-600 !border-cream-400/50 dark:!border-ink-500/40 !text-ink-700 dark:!text-ink-50",
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
