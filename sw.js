/* Calorie Count — service worker
 *
 * Strategy: stale-while-revalidate on same-origin GETs.
 *   - Opening the app always serves from cache, so it works instantly with no
 *     signal at all (which is the point — supermarkets eat mobile data).
 *   - Every fetch also quietly asks the network for a fresher copy and stores
 *     it, so a push to GitHub lands on the *next* launch after the one where
 *     it was downloaded.
 *
 * If you edit index.html and want the change to land, bump VERSION. The old
 * cache is deleted on activate, so nothing accumulates.
 */

const VERSION = 'v4';
const CACHE = `calcount-${VERSION}`;

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll is all-or-nothing; add individually so one 404 can't
      // stop the whole worker from installing.
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(e => console.warn('skip', u, e)))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });

      const fresh = fetch(req).then(res => {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
        return res;
      }).catch(() => null);

      // Cache first when we have it; otherwise wait on the network.
      if (cached) { event.waitUntil(fresh); return cached; }

      const res = await fresh;
      if (res) return res;

      // Offline and never cached: for a page request, fall back to the shell
      // so navigation still lands somewhere useful.
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      return new Response('Offline and not cached.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
