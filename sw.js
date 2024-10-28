// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('librus-pwa-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/icons/icon-192x192.png',
                '/manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Разрешаем cross-origin запросы
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});