const CACHE_NAME = 'librus-info-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icons/android-chrome-192x192.png',
    './icons/android-chrome-512x512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-16x16.png',
    './icons/favicon-32x32.png'
];

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker caching files.');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker cache error:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});