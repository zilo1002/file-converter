const CACHE_NAME = 'formathub-v2';
const STATIC_ASSETS = [
  '/file-converter/',
  '/file-converter/index.html',
  '/file-converter/manifest.json',
  // Core app
  '/file-converter/src/main.js',
  '/file-converter/src/utils.js',
  '/file-converter/src/converters/pdf.js',
  '/file-converter/src/converters/document.js',
  '/file-converter/src/converters/image.js',
  '/file-converter/src/converters/data.js',
  '/file-converter/src/converters/ebook.js',
  '/file-converter/src/converters/archive.js',
  '/file-converter/src/converters/format.js',
  '/file-converter/src/workers/data.worker.js',
  '/file-converter/src/workers/doc.worker.js',
  '/file-converter/src/workers/ebook.worker.js',
  // CDN libs
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
  'https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.min.js',
];

// Install: cache all static assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      })
    )
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for same-origin, stale-while-revalidate for CDN
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Same-origin: cache-first
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // CDN libs: stale-while-revalidate
  if (STATIC_ASSETS.includes(request.url)) {
    e.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Everything else: network with offline fallback
  e.respondWith(
    fetch(request).catch(() => {
      if (request.mode === 'navigate') {
        return caches.match('/file-converter/index.html');
      }
    })
  );
});

// Message handler for update detection
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
