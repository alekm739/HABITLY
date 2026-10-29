// Habitly service worker: guarda la app para que funcione sin internet
// y busca siempre la versión más nueva cuando hay conexión.
const CACHE = 'habitly-v9';
const SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'];

self.addEventListener('install', e => {
  // Cada archivo por separado: si alguno falla, el resto igual se guarda
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase (login y datos) nunca pasa por la caché
  if (/googleapis\.com|firebaseio\.com|firebaseapp\.com/.test(url.hostname)) return;
  // La app y sus archivos propios: primero red (sin caché del navegador), si no hay internet la copia guardada
  if (req.mode === 'navigate' || url.origin === self.location.origin) {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './index.html' : req, cp)); }
      return r;
    }).catch(() => caches.match(req.mode === 'navigate' ? './index.html' : req).then(r => r || caches.match('./index.html'))));
    return;
  }
  // Librerías y fuentes externas: primero caché, luego red
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  })));
});
