const CACHE_NAME = 'hw-portfolio-v17';
const ASSETS = [
   './',
   './index.html',
   './harry1.jpg',
   './harry2.jpg',
   './harry3.jpg',
   './harry4.jpg',
   './photo1.jpg',
   './photo2.jpg',
   './photo3.jpg',
   './photo4.jpg',
   './photo5.jpg',
   './ict_cctv.png',
   './ict_smart.png',
   './ict_fence.png',
   './corp_thumbnail.png'
];

// Install Event
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event using Stale-While-Revalidate Strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        // Fetch background update
        fetch(e.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
