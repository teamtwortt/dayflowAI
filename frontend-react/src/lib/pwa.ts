export function registerServiceWorker() {
  if (
    "serviceWorker" in navigator &&
    import.meta.env.PROD &&
    window.location.protocol === "https:"
  ) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn("SW registration failed:", err);
        });
    });
  }
}
