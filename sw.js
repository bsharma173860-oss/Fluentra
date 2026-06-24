// Fluentra service worker — network-first so users always get the latest;
// cached copies are only used as an offline fallback. /api/ is never cached.
const CACHE = 'fluentra-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;     // skip cross-origin (Supabase/Anthropic/Stripe)
  if (url.pathname.startsWith('/api/')) return;         // never cache dynamic API
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req))
  );
});
