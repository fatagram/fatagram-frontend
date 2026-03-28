const CACHE_NAME = "fatagram-cache-v1";
// Only cache static assets, not HTML
const ASSETS_TO_CACHE = ["/vite.svg"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isHtmlRequest =
    request.headers.get("accept")?.includes("text/html") || url.pathname.endsWith("/");

  // Network-first for HTML/navigation: always try fresh content first
  if (isHtmlRequest) {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => {
          // If offline, try to return a cached version
          return caches.match(request).then((cached) => {
            return cached || caches.match("/index.html");
          });
        }),
    );
    return;
  }

  // Cache-first for other assets (JS, CSS, images, etc.)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Don't cache unsuccessful responses
        if (!response || response.status !== 200) return response;

        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    }),
  );
});
