self.addEventListener('install', (e) => {
  console.log('[Service Worker] Instalado com sucesso');
});

self.addEventListener('fetch', (e) => {
  // Apenas deixa o app fluir na internet
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
