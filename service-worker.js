// service-worker.js (skeleton)
// NOTE: Implement caching strategies and precache manifest during build steps for production.

self.addEventListener('install', event => {
  console.log('Service worker installing...');
});
self.addEventListener('activate', event => {
  console.log('Service worker activated');
});
self.addEventListener('fetch', event => {
  // Basic network-first strategy for API calls, cache-first for static assets could be added.
  // For now, pass through.
  event.respondWith(fetch(event.request));
});
