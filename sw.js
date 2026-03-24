const CACHE_NAME = 'bdebazar-v1.0.0';
const STATIC_CACHE = 'bdebazar-static-v1';
const DYNAMIC_CACHE = 'bdebazar-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/complete-style.css',
  '/css/variables.css',
  '/css/fluid-typography.css',
  '/css/layout/responsive.css',
  '/js/app.js',
  '/js/data/productsData.js',
  '/imageForGBBD/logo2.jpg',
  '/imageForGBBD/pureHero.png',
  '/favicon.ico',
  '/robots.txt'
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const JS_EXTENSIONS = ['.js'];
const CSS_EXTENSIONS = ['.css'];

function shouldCache(request) {
  const url = new URL(request.url);
  
  if (url.origin !== location.origin) {
    return false;
  }
  
  if (request.method !== 'GET') {
    return false;
  }
  
  const pathname = url.pathname;
  
  if (pathname.includes('/api/') || pathname.includes('/server/')) {
    return false;
  }
  
  return true;
}

function getCacheType(url) {
  const pathname = new URL(url).pathname;
  
  for (const ext of IMAGE_EXTENSIONS) {
    if (pathname.endsWith(ext)) return 'image';
  }
  for (const ext of JS_EXTENSIONS) {
    if (pathname.endsWith(ext)) return 'js';
  }
  for (const ext of CSS_EXTENSIONS) {
    if (pathname.endsWith(ext)) return 'css';
  }
  
  return 'other';
}

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[SW] Precache failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('bdebazar-') && 
                     name !== STATIC_CACHE && 
                     name !== DYNAMIC_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (!shouldCache(request)) {
    return;
  }
  
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then((response) => {
          return response || fetch(request);
        })
    );
    return;
  }
  
  const cacheType = getCacheType(request.url);
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          if (navigator.onLine) {
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  const responseClone = networkResponse.clone();
                  caches.open(DYNAMIC_CACHE)
                    .then((cache) => cache.put(request, responseClone));
                }
              })
              .catch(() => {});
          }
          return cachedResponse;
        }
        
        return fetch(request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            const responseClone = networkResponse.clone();
            const cacheName = cacheType === 'image' ? DYNAMIC_CACHE : DYNAMIC_CACHE;
            
            caches.open(cacheName)
              .then((cache) => cache.put(request, responseClone));
            
            return networkResponse;
          })
          .catch(() => {
            if (cacheType === 'image') {
              return caches.match('/imageForGBBD/logo.webp');
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames
              .filter((name) => name.startsWith('bdebazar-'))
              .map((name) => caches.delete(name))
          );
        })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  console.log('[SW] Syncing cart data...');
}

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New updates available!',
    icon: '/imageForGBBD/logo2.jpg',
    badge: '/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'View Products' },
      { action: 'close', title: 'Close' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BD eBazar', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
