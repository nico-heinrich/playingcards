self.oninstall = function() {
    caches.open("randomPlayingCards")
    .then(function(cache) {
        cache.addAll([
            "/",
            "index.html",
            "/suits/"
        ])
        .then(function() {
            console.log("Cashed!")
        })
        .catch(function(err) {
            console.log("Error: " + err);
        })
    })
}

self.onactivate = function() {
    console.log("Activated!");
}

self.onfetch = function(e) {
    e.respondWith(
        caches.match(e.request)
        .then(function(response) {
            if (response) {
                return response;
            } else {
                return fetch(e.request);
            }
        })
    )
}