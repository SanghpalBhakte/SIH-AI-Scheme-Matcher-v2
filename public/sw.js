// Minimal hand-rolled service worker — no Workbox/next-pwa dependency,
// so behavior stays fully readable and predictable for a hackathon
// prototype. Two jobs only: (1) cache-first for Next's content-hashed
// static assets, since they never change under a given filename, and
// (2) network-first-with-cache-fallback for page navigations, so a
// page someone has already visited keeps working offline, and a page
// that's never been visited falls back to /offline instead of a raw
// browser error.
const CACHE_VERSION = 'schemesetu-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const PAGES_CACHE = `${CACHE_VERSION}-pages`
const OFFLINE_URL = '/offline'

const PRECACHE_URLS = [OFFLINE_URL, '/manifest.json', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('schemesetu-') && key !== STATIC_CACHE && key !== PAGES_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Next.js build output is content-hashed (filename changes when the
  // content does), so caching it indefinitely is safe. /_next/image is
  // included too — it's the optimizer route the homepage's hero photo
  // goes through (see components/landing/hero-photo.tsx); a given
  // url+width+quality combination is just as stable as a hashed
  // filename, and caching it means the hero photo keeps working
  // offline after a first visit, same as everything else here.
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/_next/image')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        const response = await fetch(request)
        if (response.ok) cache.put(request, response.clone())
        return response
      })
    )
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            // .clone() has to happen right here, synchronously, before
            // this callback returns `response` to the browser — a
            // Response's body can only be cloned before anyone has
            // started reading it. The previous version called
            // response.clone() lazily inside the .then() below, after
            // caches.open() had resolved — by then the browser had
            // already started consuming the original response to
            // render the page, so every clone() call was throwing
            // ("Response body is already used") and failing silently:
            // this cache had never actually cached a single page.
            // event.waitUntil is the other half of the fix: without
            // it, nothing stops the browser tearing down this worker
            // the instant `response` is returned, before the write
            // below (now using the pre-made clone) finishes.
            const responseToCache = response.clone()
            event.waitUntil(caches.open(PAGES_CACHE).then((cache) => cache.put(request, responseToCache)))
          }
          return response
        })
        .catch(async () => {
          const cache = await caches.open(PAGES_CACHE)
          const cached = await cache.match(request)
          return cached || caches.match(OFFLINE_URL)
        })
    )
  }
})
