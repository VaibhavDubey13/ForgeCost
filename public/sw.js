// ForgeCost Service Worker
// Strategy: Cache-first for static assets, network-first for API/dynamic

const CACHE_VERSION = "forgecost-v1";
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Core app shell — cache on install
const APP_SHELL = [
  "/",
  "/app",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// ── Install: cache app shell ─────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("forgecost-") && key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: smart caching strategy ────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, and API routes (always network)
  if (
    request.method !== "GET" ||
    url.protocol === "chrome-extension:" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/webpack-hmr")
  ) {
    return;
  }

  // Supabase and external APIs — always network
  if (
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("dodopayments.com") ||
    url.hostname.includes("resend.com")
  ) {
    return;
  }

  // Next.js static assets (_next/static) — cache-first, long lived
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            return res;
          })
      )
    );
    return;
  }

  // App pages — network-first, fall back to cache
  event.respondWith(
    fetch(request)
      .then((res) => {
        // Cache successful responses
        if (res.ok) {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return res;
      })
      .catch(() =>
        // Offline fallback — serve from cache
        caches.match(request).then(
          (cached) =>
            cached ||
            caches.match("/app") || // fallback to app shell
            new Response(
              `<!DOCTYPE html>
              <html>
                <head><title>ForgeCost — Offline</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <style>
                  body { background: #060d1a; color: #94a3b8; font-family: system-ui, sans-serif;
                         display: flex; align-items: center; justify-content: center;
                         min-height: 100vh; margin: 0; text-align: center; padding: 20px; }
                  h1 { color: #34d399; font-size: 1.5rem; margin-bottom: 8px; }
                  p { font-size: 0.9rem; max-width: 280px; }
                  a { color: #10b981; }
                </style>
                </head>
                <body>
                  <div>
                    <h1>⚡ ForgeCost</h1>
                    <p>You're offline. Connect to the internet to use ForgeCost.</p>
                    <p style="margin-top:16px"><a href="/app">Try again</a></p>
                  </div>
                </body>
              </html>`,
              { headers: { "Content-Type": "text/html" } }
            )
        )
      )
  );
});