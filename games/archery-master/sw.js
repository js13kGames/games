var version = 'v2';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(version)
      .then((cache) => cache.addAll(['index.html', 'bundle.js', 'styles.css']))
  );
});

self.addEventListener('activate', (event) => {
  self.clients
    .matchAll({
      includeUncontrolled: true
    })
    .then((clientList) => {
      clientList.map((client) => client.url);
    });
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== version) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (
    event.request.cache === 'only-if-cached' &&
    event.request.mode !== 'same-origin'
  )
    return;
  event.respondWith(
    caches.match(event.request).then(
      (resp) =>
        resp ||
        fetch(event.request).then((response) =>
          caches.open(version).then((cache) => {
            if (
              event.request.method !== 'POST' &&
              !event.request.url.includes('socket.io')
            ) {
              try {
                cache.put(event.request, response.clone());
              } catch (e) {
                console.log(e);
              }
            }
            return response;
          })
        )
    )
  );
});
