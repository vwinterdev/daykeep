/* global CACHE, SHELL, STATIC */
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })))))
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('journal-') && key !== CACHE) await caches.delete(key)
    }
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.search ||
      request.headers.has('authorization') || request.headers.has('apikey')) return

  if (request.mode === 'navigate' && (url.pathname === '/' || url.pathname === '/index.html')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE)
      // Serve the document from the same build as the cached static assets.
      return (await cache.match('/index.html')) ?? fetch(request)
    })())
  } else if (STATIC.has(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE)
      // Only fixed build assets are allowlisted; Vite may vary the same file by Origin.
      const cached = await cache.match(url.pathname, { ignoreVary: true })
      if (cached) return cached
      const response = await fetch(request)
      if (response.ok && !response.redirected) await cache.put(request, response.clone())
      return response
    })())
  }
})
