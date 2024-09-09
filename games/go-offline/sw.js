const CACHE_KEY = 'go-offline::v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_KEY).then(function(cache) {
      // using a Promise.all trick (via https://davidwalsh.name/promises-results)
      // instead of cache.addAll, not to fail on non-existing paths
      return Promise.all([
        // GitHub pages hosted demo
        cache.add('/go-offline/'),
        cache.add('/go-offline/index.html'),
        // js13kgames hosted path
        cache.add('/games/go-offline/'),
        cache.add('/games/go-offline/index.html'),
        // relative file name - that in theory would be enough
        cache.add('index.html')
      ].map(p => p.catch(() => undefined)));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // simplified eventually fresh cache pattern based on:
    // https://css-tricks.com/serviceworker-for-offline/
    caches.match(event.request).then(function(cached) {
      let networked = fetch(event.request)
        .then(response => {
          caches
            .open(CACHE_KEY)
            .then(cache => cache.put(event.request, response.clone()));
        })
        .catch(() => undefined);
     return cached || networked;
   })
 );
});
