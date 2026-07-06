// ClipBook Service Worker - Offline support + caching
const CACHE_NAME = 'clipbook-v2';
const STATIC_ASSETS = [
  '/barber-app/',
  '/barber-app/index.html',
  '/barber-app/app.jsx',
  '/barber-app/lib/supabase.js',
  '/barber-app/lib/linq.js',
  '/barber-app/lib/utils.js',
  '/barber-app/components/UI.jsx',
  '/barber-app/components/Auth.jsx',
  '/barber-app/components/Dashboard.jsx',
  '/barber-app/components/Calendar.jsx',
  '/barber-app/components/ClientList.jsx',
  '/barber-app/components/Messages.jsx',
  '/barber-app/components/Settings.jsx',
  '/barber-app/components/BookingPage.jsx',
  '/barber-app/components/ShopManager.jsx',
  '/barber-app/components/Analytics.jsx',
  '/barber-app/manifest.json'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API calls (Supabase, Linq) — network only
  if (url.hostname.includes('supabase') || url.hostname.includes('linqapp')) {
    return;
  }

  // CDN resources — cache first
  if (url.hostname.includes('unpkg.com') || url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Static assets — network first, fall back to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
