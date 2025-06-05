// AlertaVia Service Worker - PWA e Notificações Push
const CACHE_NAME = 'alertavia-v2.0';
const DYNAMIC_CACHE = 'alertavia-dynamic-v2.0';
const STATIC_CACHE = 'alertavia-static-v2.0';

const urlsToCache = [
    '/',
    '/index.html',
    '/mapa.html',
    '/styles.css',
    '/map-styles.css',
    '/script.js',
    '/map-script.js',
    '/api-service.js',
    '/auth-manager.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// URLs que devem sempre vir da rede (dados em tempo real)
const networkFirst = [
    '/api/',
    'api.openweathermap.org',
    'nominatim.openstreetmap.org'
];

// Instalar o service worker
self.addEventListener('install', event => {
    console.log('SW: Instalando service worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('SW: Cache estático criado');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativar o service worker
self.addEventListener('activate', event => {
    console.log('SW: Ativando service worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('SW: Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptar requisições com estratégias diferenciadas
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Estratégia Network First para APIs em tempo real
    if (networkFirst.some(url => event.request.url.includes(url))) {
        event.respondWith(networkFirstStrategy(event.request));
        return;
    }
    
    // Estratégia Cache First para recursos estáticos
    if (event.request.destination === 'image' || 
        event.request.url.includes('.css') || 
        event.request.url.includes('.js') ||
        event.request.url.includes('fonts.googleapis.com')) {
        event.respondWith(cacheFirstStrategy(event.request));
        return;
    }
    
    // Estratégia Stale While Revalidate para páginas HTML
    event.respondWith(staleWhileRevalidateStrategy(event.request));
});

// Estratégia Network First - busca na rede, fallback para cache
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('SW: Rede falhou, buscando no cache:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Retorna uma resposta offline personalizada para APIs
        return new Response(JSON.stringify({
            error: 'Dados não disponíveis offline',
            offline: true,
            timestamp: new Date().toISOString()
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Estratégia Cache First - busca no cache, fallback para rede
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('SW: Recurso não disponível:', request.url);
        return new Response('Recurso não disponível offline', { status: 404 });
    }
}

// Estratégia Stale While Revalidate - serve do cache e atualiza em background
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

// Gerenciar notificações push
self.addEventListener('push', event => {
    console.log('SW: Notificação push recebida');
    
    let data = {};
    if (event.data) {
        data = event.data.json();
    }
    
    const options = {
        title: data.title || 'AlertaVia',
        body: data.body || 'Nova atualização disponível',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        image: data.image,
        tag: data.tag || 'general',
        requireInteraction: data.urgent || false,
        actions: [
            {
                action: 'view',
                title: 'Ver detalhes',
                icon: '/icon-view.png'
            },
            {
                action: 'dismiss',
                title: 'Dispensar',
                icon: '/icon-dismiss.png'
            }
        ],
        data: {
            url: data.url || '/',
            timestamp: Date.now()
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(options.title, options)
    );
});

// Lidar com cliques em notificações
self.addEventListener('notificationclick', event => {
    console.log('SW: Clique na notificação:', event.action);
    
    event.notification.close();
    
    if (event.action === 'dismiss') {
        return;
    }
    
    const url = event.notification.data.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // Tentar focar em uma janela existente
                for (const client of clientList) {
                    if (client.url.includes(url) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Abrir nova janela se necessário
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// Sincronização em background
self.addEventListener('sync', event => {
    console.log('SW: Sincronização em background:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Aqui você pode sincronizar dados pendentes, 
        // enviar métricas, atualizar cache, etc.
        console.log('SW: Executando sincronização em background');
        
        // Exemplo: limpar cache antigo
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name.startsWith('alertavia-') && 
            name !== STATIC_CACHE && 
            name !== DYNAMIC_CACHE
        );
        
        await Promise.all(oldCaches.map(cache => caches.delete(cache)));
        
    } catch (error) {
        console.error('SW: Erro na sincronização:', error);
    }
}

// Lidar com mudanças de conectividade
self.addEventListener('online', () => {
    console.log('SW: Conexão restaurada');
    // Sincronizar dados pendentes
    self.registration.sync.register('background-sync');
});

self.addEventListener('offline', () => {
    console.log('SW: Modo offline ativado');
});
