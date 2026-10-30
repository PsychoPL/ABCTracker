// ABC Tracker — service worker : sert uniquement les fichiers de l'application depuis le cache
// (fonctionnement hors ligne). Il ne voit et ne transmet aucune donnée saisie.
const VERSION = "abc-tracker-v3";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  // Réseau d'abord pour récupérer les mises à jour de l'appli, cache si hors ligne.
  e.respondWith(
    fetch(e.request).then((r) => {
      if (r.ok && FILES.some((f) => url.pathname.endsWith(f.replace("./", "/")) || url.pathname.endsWith("/"))) {
        const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((m) => m || caches.match("./index.html")))
  );
});
