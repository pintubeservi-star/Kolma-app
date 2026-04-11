self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Este código permite que la app cargue online normalmente
  event.respondWith(fetch(event.request));
});
