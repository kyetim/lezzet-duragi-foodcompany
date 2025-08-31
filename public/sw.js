const CACHE_NAME = 'lezzet-duragi-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json'
];

// Separate caches for different content types
const API_CACHE_NAME = 'lezzet-duragi-api-v2';
const IMAGE_CACHE_NAME = 'lezzet-duragi-images-v1';
const FONT_CACHE_NAME = 'lezzet-duragi-fonts-v1';

// Cache duration constants
const MENU_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const IMAGE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const FONT_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

// Critical resources to precache immediately
const CRITICAL_RESOURCES = [
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        if (typeof importScripts === 'undefined') {
          console.error('Service Worker yükleme hatası:', error);
        }
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API istekleri için Cache First Strategy
  if (url.pathname.includes('/api/') || url.pathname.includes('firebase')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Menu data için Cache First
  if (url.pathname.includes('/menu') || url.searchParams.has('menu')) {
    event.respondWith(handleMenuRequest(request));
    return;
  }
  
  // Static assets için Cache First Strategy
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(handleStaticAssets(request));
    return;
  }
  
  // HTML pages için Network First Strategy
  if (request.destination === 'document') {
    event.respondWith(handlePageRequest(request));
    return;
  }
  
  // Diğer istekler için Network First
  event.respondWith(handleGenericRequest(request));
});

// Cache First Strategy - API istekleri
async function handleApiRequest(request) {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 API cache\'den sunuluyor:', request.url);
      
      // Background'da güncel veriyi getir
      fetch(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        })
        .catch(() => {});
      
      return cachedResponse;
    }
    
    // Cache'de yoksa network'den getir
    const response = await fetch(request);
    
    if (response.ok) {
      console.log('🌐 API network\'den getiriliyor ve cache ediliyor:', request.url);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('⚠️ API isteği başarısız, offline fallback');
    return new Response(
      JSON.stringify({ 
        error: 'Çevrimdışı modu - Veriler güncel olmayabilir',
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache First Strategy - Menu data
async function handleMenuRequest(request) {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Cache'de varsa ve fresh ise kullan
    if (cachedResponse) {
      const cachedDate = cachedResponse.headers.get('cached-date');
      const isExpired = cachedDate ? 
        (Date.now() - parseInt(cachedDate)) > MENU_CACHE_DURATION : true;
      
      if (!isExpired) {
        console.log('🍽️ Menü cache\'den sunuluyor');
        return cachedResponse;
      }
    }
    
    // Network'den fresh data getir
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache'e tarih ile birlikte kaydet
      const responseClone = response.clone();
      const modifiedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...Object.fromEntries(responseClone.headers.entries()),
          'cached-date': Date.now().toString()
        }
      });
      
      cache.put(request, modifiedResponse);
      console.log('🍽️ Menü güncellendi ve cache edildi');
    }
    
    return response;
  } catch (error) {
    // Offline durumunda cached data döndür
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📱 Offline - Menü cache\'den sunuluyor');
      return cachedResponse;
    }
    
    return new Response('Menü çevrimdışı durumda yüklenemedi', { status: 503 });
  }
}

// Cache First Strategy - Static assets
async function handleStaticAssets(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('⚡ Static asset cache\'den sunuluyor');
      return cachedResponse;
    }
    
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
      console.log('⚡ Static asset cache edildi:', request.url);
    }
    
    return response;
  } catch (error) {
    console.log('⚠️ Static asset yüklenemedi:', request.url);
    return new Response('Dosya bulunamadı', { status: 404 });
  }
}

// Network First Strategy - HTML pages
async function handlePageRequest(request) {
  try {
    console.log('🌐 Sayfa network\'den yükleniyor:', request.url);
    const response = await fetch(request);
    
    // Başarılı response'u cache'e kaydet
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Offline durumunda cache'den döndür
    console.log('📱 Offline - Sayfa cache\'den sunuluyor');
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Offline sayfası döndür
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Çevrimdışı - Lezzet Durağı</title>
          <style>
            body { 
              font-family: Arial; 
              text-align: center; 
              padding: 50px;
              background: linear-gradient(135deg, #ea580c, #dc2626);
              color: white;
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto;
              background: rgba(255,255,255,0.1);
              padding: 30px;
              border-radius: 15px;
            }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <h1>📱 Çevrimdışı Modu</h1>
            <p>İnternet bağlantınızı kontrol edin</p>
            <p>Cached verilerle bazı özellikler kullanılabilir</p>
            <button onclick=\"window.location.reload()\">🔄 Tekrar Dene</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Generic Network First Strategy
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('İstek başarısız', { status: 503 });
  }
}

// Background Sync - Offline order queue
self.addEventListener('sync', (event) => {
  if (event.tag === 'order-sync') {
    console.log('🔄 Offline siparişler senkronize ediliyor...');
    event.waitUntil(syncOfflineOrders());
  }
});

async function syncOfflineOrders() {
  // TODO: IndexedDB'den offline siparişleri al ve gönder
  console.log('📝 Offline sipariş senkronizasyonu henüz implement edilmedi');
}

// Push Notification handler
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification alındı');
  
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/orders'
    },
    actions: [
      {
        action: 'view',
        title: 'Görüntüle',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icons/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Lezzet Durağı', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification tıklandı:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});