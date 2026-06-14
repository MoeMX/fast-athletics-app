const CACHE_NAME = 'fast-athletics-v4';
const PRECACHE = ['/icon-192.png', '/icon-512.png', '/logo.png', '/manifest.json'];

self.addEventListener('install', e => {
        self.skipWaiting();
        e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', e => {
        e.waitUntil(
                    caches.keys().then(keys =>
                                    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
                                               ).then(() => {
                                    self.clients.claim();
                                    // Tell all open clients to reload so they pick up the new version immediately
                                                                  return self.clients.matchAll({ type: 'window' }).then(clients => {
                                                                                      clients.forEach(client => {
                                                                                                              client.postMessage({ type: 'SW_UPDATED' });
                                                                                          });
                                                                  });
                    })
                );
});

self.addEventListener('fetch', e => {
        const url = new URL(e.request.url);
        const path = url.pathname;

                          // Never cache data.json — always fetch from network so admin panel updates
                          // reach the PWA immediately without requiring a service worker bump
                          if (path === '/data.json') {
                                      e.respondWith(fetch(e.request));
                                      return;
                          }

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
