/* Minimal service worker — enables “Install app” in Chrome/Edge when paired with manifest */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  /* Network-first; no offline cache — keeps installability without stale data */
});
