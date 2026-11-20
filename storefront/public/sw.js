// JAEL service worker. It only keeps the "you are offline" page.
// Products, prices and stock are never saved, so shoppers never see old data.
const CACHE = "jael-shell-v1";
const OFFLINE = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([OFFLINE, "/icons/192"]))
      .then(() => self.skipWaiting()),
  );
});

// Remove saved copies from older versions of this file (and from any older project on this address)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Only page loads are handled. If the network fails, show the offline page
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE)));
});
