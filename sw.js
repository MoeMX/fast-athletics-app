const CACHE_NAME = 'fast-athletics-v3';
const PRECACHE = ['/icon-192.png', '/icon-512.png', '/logo.png', '/manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const path = url.pathname;

  // Cache-first only for images and fonts
  const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot)$/i.test(path);

  if (isStaticAsset) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }))
    );
  } else {
    // Network-first for everything else: HTML, JS, JSON, extensionless URLs
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
  }
});