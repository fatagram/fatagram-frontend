const CACHE_NAME = "fatagram-cache-v2";

// Danh sách các assets (tài sản) tối thiểu để chạy offline
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/vite.svg",
  // Ông nhớ thêm đường dẫn icon PNG 192 và 512 vào đây sau khi tạo xong nhé
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

self.addEventListener("activate", (event) => {
  // Xóa cache cũ khi update version (cập nhật phiên bản)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // QUAN TRỌNG: Chỉ xử lý HTTP/HTTPS để tránh lỗi 'chrome-extension' (tiện ích mở rộng)
  if (!request.url.startsWith("http")) return;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Kiểm tra nếu là request cho trang HTML (navigation)
  const isHtmlRequest =
    request.headers.get("accept")?.includes("text/html") || url.pathname.endsWith("/");

  // Network-first (Ưu tiên mạng) cho HTML: Luôn lấy nội dung mới nhất
  if (isHtmlRequest) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Lưu bản copy mới nhất vào cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Nếu mất mạng, trả về bản trong cache hoặc index.html
          return caches.match(request).then((cached) => {
            return cached || caches.match("/index.html");
          });
        }),
    );
    return;
  }

  // Cache-first (Ưu tiên bộ nhớ đệm) cho static assets (JS, CSS, Images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    }),
  );
});
