/* ============================================
   Service Worker — CPTSD Guide
   Cache-first strategy for offline access
   ============================================ */

const CACHE_NAME = 'cptsd-guide-v2';
const PRECACHE_ASSETS = [
  '/childhood-trauma-study/index.html',
  '/childhood-trauma-study/cptsd-en.html',
  '/childhood-trauma-study/development-en.html',
  '/childhood-trauma-study/references-en.html',
  '/childhood-trauma-study/CPTSD%20childhood%20trauma.html',
  '/childhood-trauma-study/development.html',
  '/childhood-trauma-study/references.html',
  '/childhood-trauma-study/CPTSD%20childhood%20trauma-cn.html',
  '/childhood-trauma-study/development-cn.html',
  '/childhood-trauma-study/references-cn.html',
  '/childhood-trauma-study/site-enhancements.css',
  '/childhood-trauma-study/site-enhancements.js',
  '/childhood-trauma-study/background-poster.jpg',
  '/childhood-trauma-study/forest-ambience.mp3'
];

/* ----- Install: precache core assets ----- */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ----- Activate: clean old caches ----- */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (name) {
          return name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ----- Fetch: cache-first, network fallback ----- */
self.addEventListener('fetch', function (event) {
  const { request } = event;

  /* Skip non-GET requests */
  if (request.method !== 'GET') return;

  /* Skip cross-origin requests */
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) {
        /* Return cached version immediately, then refresh in background */
        fetch(request).then(function (networkResponse) {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(function () {});
        return cached;
      }

      /* Not in cache: fetch and cache */
      return fetch(request).then(function (networkResponse) {
        if (!networkResponse || !networkResponse.ok) {
          return networkResponse;
        }
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, clone);
        });
        return networkResponse;
      }).catch(function () {
        /* Network failed — return offline fallback if we have one */
        if (request.mode === 'navigate') {
          return caches.match('/childhood-trauma-study/index.html');
        }
      });
    })
  );
});
