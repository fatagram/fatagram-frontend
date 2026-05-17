const CACHE_NAME = "fawe-cache-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/svgs/fawe.svg",
  "/svgs/logo-nobg.svg",
  "/svgs/logo-nobg-color.svg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))),
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // CHẶN LỖI: Chỉ xử lý giao thức http và https
  if (!url.protocol.startsWith("http")) return;
  if (request.method !== "GET") return;

  const isHtmlRequest =
    request.headers.get("accept")?.includes("text/html") || url.pathname.endsWith("/");

  if (isHtmlRequest) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((res) => {
          if (!res || res.status !== 200 || res.type !== "basic") return res;
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return res;
        })
      );
    }),
  );
});
