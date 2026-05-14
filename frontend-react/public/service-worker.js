/* DayFlow AI — service worker
 *
 * Strategy:
 *   - precache the shell on install
 *   - network-first for API requests (so data is always fresh)
 *   - cache-first for static assets (so the app loads when offline)
 *   - fall back to /offline.html when the shell is requested while offline
 */
const CACHE_NAME = "dayflow-ai-v1";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/favicon.svg", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Don't try to cache API calls
  if (
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/events") ||
    url.pathname.startsWith("/briefing") ||
    url.pathname.startsWith("/users") ||
    url.pathname.startsWith("/ai") ||
    url.pathname.startsWith("/health")
  ) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: "offline" }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );
    return;
  }

  // Navigation requests → network first, fall back to cached shell, then offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put("/index.html", copy));
          return resp;
        })
        .catch(() =>
          caches.match("/index.html").then(
            (cached) => cached || caches.match("/offline.html"),
          ),
        ),
    );
    return;
  }

  // Static assets → cache first
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((resp) => {
          if (resp.ok && resp.type === "basic") {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return resp;
        }),
    ),
  );
});
