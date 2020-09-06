const staticDevCoffee = "dev-coffee-site-v1"
const assets = [
  "..//",
  "../index.html",
  "../css/bootstrap-theme.min.css",
  "../css/bootstrap.min.css",
  "../css/styles.css",
  "../js/script.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})