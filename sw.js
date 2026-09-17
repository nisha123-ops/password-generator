const { cache } = require("react");

const CACHE_NAME = "passgen-v1";
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/manifest.json"
];

//App install hone par files ko cache me save karega
self.addEventListener("install", (event) => {
    event.waitUntil(
        cache.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Offline access aur fast loading ke liye
self.addEventListener("fetch", (event) => {
    event.respondWith(
        cache.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

//Register Service Worker for PWA
if("serviceWorker" in navigator){
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw,js")
        .then((reg) => console.log("Service Worker Registered!", reg))
        .catch((err) => console.log("Service Worker Failed!", err));
    });
}