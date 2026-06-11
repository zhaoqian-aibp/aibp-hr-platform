const CACHE_NAME = 'aibp-hr-v1';
const BASE_PATH = '/aibp-hr-platform';

// Assets to cache on install (will be updated by build)
const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/version.json`,
];

// Install: precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the successful response
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Network failed, serve from cache
          return caches.match(event.request).then((cached) => {
            return cached || caches.match(`${BASE_PATH}/`);
          });
        })
    );
    return;
  }

  // JS/CSS/assets: network-first to get latest builds
  if (url.pathname.startsWith(`${BASE_PATH}/assets/`) ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.woff')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Other requests: cache-first (version.json, images, etc.)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Only cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// Version check: listen for messages from the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_VERSION') {
    fetch(`${BASE_PATH}/version.json`, { cache: 'no-cache' })
      .then((res) => res.json())
      .then((serverVersion) => {
        // Notify all clients about the version
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'VERSION_CHECK_RESULT',
              serverVersion: serverVersion.version,
              buildTime: serverVersion.buildTime,
            });
          });
        });
      })
      .catch(() => {
        // Version check failed, likely offline - no action needed
      });
  }

  if (event.data && event.data.type === 'FORCE_UPDATE') {
    // Clear all caches and reload
    caches.keys().then((keys) => {
      Promise.all(keys.map((key) => caches.delete(key))).then(() => {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.navigate(client.url));
        });
      });
    });
  }
});