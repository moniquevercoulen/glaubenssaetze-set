// Glaubenssaetze-Set – PWA Service Worker
const CACHE_VERSION = "v1-glaubenssaetze";
const BASE_PATH = "/glaubenssaetze-set/";   // genau so lassen

const FILES = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.webmanifest",
  BASE_PATH + "icon-256.png",
  BASE_PATH + "icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(FILES)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(BASE_PATH + "index.html"))
    )
  );
});
