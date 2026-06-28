// Fluentra service worker — network-first so users always get the latest;
// cached copies are an offline fallback only. /api/ is never cached.
// Cache is versioned and old versions are purged on activate (no storage bloat).
const CACHE = 'fluentra-v3';
const OFFLINE = '/screens/offline.html';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all([c.add('/').catch(() => {}), c.add(OFFLINE).catch(() => {})]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;     // skip cross-origin (Supabase/Anthropic/Stripe)
  if (url.pathname.startsWith('/api/')) return;         // never cache dynamic API
  e.respondWith(
    fetch(req, req.mode === 'navigate' ? { cache: 'reload' } : undefined).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() =>
      caches.match(req).then((hit) => {
        if (hit) return hit;
        // Offline + nothing cached: serve the app shell for a page navigation,
        // then the standalone offline page, then a minimal inline notice.
        if (req.mode === 'navigate') {
          return caches.match('/')
            .then((shell) => shell || caches.match(OFFLINE))
            .then((f) => f || new Response('<!doctype html><meta charset="utf-8"><title>Offline</title><body style="font-family:system-ui;padding:40px;text-align:center;color:#3a2a20"><h1>You\u2019re offline</h1><p>Reconnect and we\u2019ll pick up where you left off.</p></body>', { status: 503, headers: { 'Content-Type': 'text/html' } }));
        }
        return new Response('', { status: 504, statusText: 'Offline' });
      })
    )
  );
});
