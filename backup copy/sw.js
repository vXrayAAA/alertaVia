// Service Worker para cache e funcionalidade offline
const CACHE_NAME = 'alertavia-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/script.js',
    '/index.html',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalar o service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se disponível, senão busca na rede
                return response || fetch(event.request);
            })
    );
});
