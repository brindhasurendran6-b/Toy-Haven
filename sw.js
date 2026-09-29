const CACHE_NAME = "toy-haven-v1";

const FILES = [
    "./",
    "index.html",
    "products.html",
    "cart.html",
    "checkout.html",
    "wishlist.html",
    "support.html",
    "css/style.css",
    "js/products-data.js",
    "js/app.js",
    "manifest.json",
    "assets/favicon.svg"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
