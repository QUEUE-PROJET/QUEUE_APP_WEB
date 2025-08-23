// Service Worker pour cache avancé
const CACHE_NAME = 'qapp-admin-v1';
const API_CACHE_NAME = 'qapp-api-v1';

// URLs à mettre en cache
const STATIC_CACHE_URLS = [
    '/',
    '/admin',
    '/admin/companies',
    '/admin/users',
    '/admin/rapports',
    '/admin/notifications',
    '/admin/settings',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Cache des API avec stratégie Network First
    if (url.pathname.includes('/api/') || url.origin.includes('127.0.0.1:8000')) {
        event.respondWith(
            networkFirstStrategy(request, API_CACHE_NAME, 30000) // 30 secondes de cache
        );
        return;
    }

    // Cache des assets avec stratégie Cache First
    if (request.destination === 'script' || 
        request.destination === 'style' || 
        request.destination === 'image') {
        event.respondWith(
            cacheFirstStrategy(request, CACHE_NAME)
        );
        return;
    }

    // Cache des pages avec stratégie Network First
    event.respondWith(
        networkFirstStrategy(request, CACHE_NAME, 60000) // 1 minute de cache
    );
});

// Stratégie Network First
async function networkFirstStrategy(request, cacheName, maxAge = 60000) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(cacheName);
            // Ajouter timestamp pour expiration
            const responseToCache = response.clone();
            responseToCache.headers.set('sw-cache-timestamp', Date.now().toString());
            cache.put(request, responseToCache);
        }
        
        return response;
    } catch (error) {
        // Fallback vers le cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            const timestamp = cachedResponse.headers.get('sw-cache-timestamp');
            const age = Date.now() - parseInt(timestamp || '0');
            
            // Retourner du cache si pas trop ancien
            if (age < maxAge) {
                return cachedResponse;
            }
        }
        
        throw error;
    }
}

// Stratégie Cache First
async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const response = await fetch(request);
    
    if (response.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
    }
    
    return response;
}

// Message pour vider le cache
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(API_CACHE_NAME)
                .then(() => event.ports[0].postMessage({ success: true }))
        );
    }
});
