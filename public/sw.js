
const CACHE_NAME = 'fitmaster-pro-v1.1';
const STATIC_CACHE = 'fitmaster-static-v1.1';
const DYNAMIC_CACHE = 'fitmaster-dynamic-v1.1';
const DATA_CACHE = 'fitmaster-data-v1.1';

// Assets critiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Ressources dynamiques
const DYNAMIC_RESOURCES = [
  '/src/',
  '/assets/'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Mise en cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DATA_CACHE).then(cache => {
        console.log('[SW] Cache des données initialisé');
        return cache.put('/offline-data', new Response('{}'));
      })
    ]).then(() => {
      console.log('[SW] Installation terminée');
      self.skipWaiting();
    })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== DATA_CACHE) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation terminée');
      self.clients.claim();
      
      // Notification de mise à jour
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'Service Worker mis à jour avec succès!'
          });
        });
      });
    })
  );
});

// Stratégies de fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API externes - Network First avec fallback
  if (url.origin !== location.origin) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // Assets statiques - Cache First
  if (STATIC_ASSETS.some(asset => request.url.includes(asset)) || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  // Pages HTML - Network First avec cache offline
  if (request.destination === 'document') {
    event.respondWith(networkFirstWithOfflineStrategy(request));
    return;
  }
  
  // Autres ressources - Stale While Revalidate
  event.respondWith(staleWhileRevalidateStrategy(request));
});

// Stratégie Cache First
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Réponse depuis le cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    console.log('[SW] Mise en cache:', request.url);
    return networkResponse;
  } catch (error) {
    console.log('[SW] Erreur cache first:', error);
    return new Response('Contenu non disponible hors ligne', { status: 503 });
  }
}

// Stratégie Network First
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, tentative cache:', request.url);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Connexion requise', { status: 503 });
  }
}

// Stratégie Network First avec fallback offline
async function networkFirstWithOfflineStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Page offline de fallback
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FitMASTER PRO - Mode Hors Ligne</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline-message { max-width: 500px; margin: 0 auto; }
            .icon { font-size: 4rem; color: #e74c3c; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <div class="icon">⚡</div>
            <h1>Mode Hors Ligne</h1>
            <p>Vous êtes actuellement hors ligne. Certaines fonctionnalités sont disponibles en mode local.</p>
            <button onclick="window.location.reload()">Réessayer</button>
          </div>
        </body>
      </html>
    `, { 
      status: 200, 
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Stratégie Stale While Revalidate
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

// Gestion des messages du client
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'CACHE_DATA':
      handleCacheData(data);
      break;
    case 'GET_CACHE_STATUS':
      handleGetCacheStatus(event);
      break;
    case 'CLEAR_CACHE':
      handleClearCache(event);
      break;
  }
});

// Mise en cache des données
async function handleCacheData(data) {
  try {
    const cache = await caches.open(DATA_CACHE);
    await cache.put('/user-data', new Response(JSON.stringify(data)));
    console.log('[SW] Données utilisateur mises en cache');
  } catch (error) {
    console.error('[SW] Erreur cache données:', error);
  }
}

// Statut du cache
async function handleGetCacheStatus(event) {
  try {
    const caches_list = await caches.keys();
    const totalSize = await getCacheSize();
    
    event.ports[0].postMessage({
      caches: caches_list.length,
      totalSize: totalSize,
      status: 'ready'
    });
  } catch (error) {
    event.ports[0].postMessage({
      error: 'Erreur lecture cache',
      status: 'error'
    });
  }
}

// Nettoyage du cache
async function handleClearCache(event) {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    );
    event.ports[0].postMessage({ status: 'cleared' });
  } catch (error) {
    event.ports[0].postMessage({ error: 'Erreur nettoyage', status: 'error' });
  }
}

// Calcul taille cache
async function getCacheSize() {
  let totalSize = 0;
  const cacheNames = await caches.keys();
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const size = await response.clone().arrayBuffer();
        totalSize += size.byteLength;
      }
    }
  }
  
  return totalSize;
}

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('[SW] Synchronisation en arrière-plan...');
  
  try {
    // Récupérer les données en attente
    const cache = await caches.open(DATA_CACHE);
    const pendingData = await cache.match('/pending-sync');
    
    if (pendingData) {
      const data = await pendingData.json();
      
      // Tenter de synchroniser chaque élément
      for (const item of data.items || []) {
        try {
          await fetch(item.url, {
            method: item.method || 'POST',
            headers: item.headers || { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          
          console.log('[SW] Élément synchronisé:', item.id);
        } catch (error) {
          console.log('[SW] Échec sync élément:', item.id, error);
        }
      }
      
      // Nettoyer les données synchronisées
      await cache.delete('/pending-sync');
    }
  } catch (error) {
    console.error('[SW] Erreur synchronisation:', error);
  }
}
