// Minimal hand-rolled service worker — no Workbox/next-pwa dependency,
// so behavior stays fully readable and predictable for a hackathon
// prototype. Two jobs only: (1) cache-first for Next's content-hashed
// static assets, since they never change under a given filename, and
// (2) network-first-with-cache-fallback for page navigations, so a
// page someone has already visited keeps working offline, and a page
// that's never been visited falls back to /offline instead of a raw
// browser error.
const CACHE_VERSION = 'schemesetu-v2'
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
  // content does), so caching it indefinitely is safe.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        const response = await fetch(request)
        // Clone BEFORE putting in cache — the original is returned to
        // the browser; the clone is stored. Without this, the body is
        // consumed by cache.put() and the browser receives an empty
        // response ("Response body is already used").
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
            // Same fix: clone before caching so the original response
            // body is still available for the browser to render.
            const toCache = response.clone()
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, toCache))
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
