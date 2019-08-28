var CACHE_NAME = 'bike_frame_calc_2019082801';
var urlsToCache = [
    '/bike_frame_calc/',
    '/bike_frame_calc/lodash.min.js',
    '/bike_frame_calc/vue.min.js',
    '/bike_frame_calc/app.js',
    '/bike_frame_calc/style.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        var online = navigator.onLine;
        if (online) {
          var fetchRequest = event.request.clone();
          return fetch(fetchRequest).then(function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
        } else {
          return response ? response : fetch(event.request);
        }
      })
  );
});
