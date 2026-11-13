/* Offline-Speicher der App.
   module.json kommt immer frisch aus dem Netz (sonst aus dem Speicher),
   alles andere aus dem Speicher und wird im Hintergrund aktualisiert. */
const CACHE = 'klassenapp-v6';
const GRUND = ['./', 'index.html', 'gemeinsam.js', 'bridge.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'module/module.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(GRUND)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const eigen = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!eigen && !fonts) return;
  if (eigen && url.pathname.endsWith('/module.json')) {
    e.respondWith(fetch(e.request).then((r) => { const k = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, k)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }
  if (eigen && (e.request.mode === 'navigate' || /\.(html|js)$/.test(url.pathname) || url.pathname.endsWith('/'))) {
    // Seiten und Skripte: erst Netz (immer aktuell), ohne Netz aus dem Speicher
    e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const k = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, k)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => {
    const netz = fetch(e.request).then((r) => {
      if (r.ok || r.type === 'opaque') { const k = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, k)); }
      return r;
    }).catch(() => hit);
    return hit || netz;
  }));
});
