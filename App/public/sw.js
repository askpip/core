/*
 * Ask Pip service worker (home-screen app, 2 October 2026).
 *
 * What it keeps on the phone: the app's own page and its files, so Ask Pip opens
 * quickly and still opens without a connection.
 *
 * What it never keeps: anything from another site. Sign-in, the journal, photos, the
 * live rose knowledge and Pip's photo look all go to Supabase and are always fetched
 * fresh. Without a connection, the app falls back to the rose knowledge bundled inside
 * it (see src/lib/lil.ts).
 *
 * How updates reach a gardener: the page itself is always fetched from the network
 * first, so a new version loads the next time the app is opened with a connection.
 * The stored copy is only used when the network cannot be reached.
 *
 * To change what is stored, bump CACHE: the old cache is deleted on activation.
 */
const CACHE = 'askpip-v1'
const SHELL = '/'

/** The /assets/... files a page refers to. */
function assetUrls(html) {
  const found = html.match(/\/assets\/[^"'\s)]+/g) || []
  return Array.from(new Set(found))
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      const response = await fetch(SHELL, { cache: 'no-store' })
      if (response.ok) {
        const html = await response.clone().text()
        await cache.put(SHELL, response)
        // Best effort: a file that fails here is stored the first time it is used.
        await Promise.all(assetUrls(html).map((url) => cache.add(url).catch(() => undefined)))
      }
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name)))
      await self.clients.claim()
    })(),
  )
})

/** The page: network first, stored copy only when the network cannot be reached. */
async function page(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) {
      const html = await response.clone().text()
      const stored = await cache.match(SHELL)
      const storedHtml = stored ? await stored.text() : null
      if (storedHtml !== html) {
        // A new version: drop the files only the old version used, before the new page
        // starts asking for its own.
        const wanted = new Set(assetUrls(html))
        const keys = await cache.keys()
        await Promise.all(
          keys
            .filter((key) => {
              const path = new URL(key.url).pathname
              return path.startsWith('/assets/') && !wanted.has(path) && /\.(js|css)$/.test(path)
            })
            .map((key) => cache.delete(key)),
        )
        await cache.put(SHELL, response.clone())
      }
    }
    return response
  } catch {
    const stored = await cache.match(SHELL)
    if (stored) return stored
    throw new Error('offline and no stored copy')
  }
}

/** Files with a fingerprint in their name never change: stored copy first. */
async function asset(request) {
  const cache = await caches.open(CACHE)
  const stored = await cache.match(request)
  if (stored) return stored
  const response = await fetch(request)
  if (response.ok) await cache.put(request, response.clone())
  return response
}

/** Icons, the manifest and the like: network first, stored copy as a fallback. */
async function other(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) await cache.put(request, response.clone())
    return response
  } catch {
    const stored = await cache.match(request)
    if (stored) return stored
    throw new Error('offline and no stored copy')
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  // Another site (Supabase, fonts): leave it to the browser. Nothing is stored.
  if (url.origin !== self.location.origin) return
  // The app's own check for a new version must always reach the network.
  if (request.cache === 'no-store') return
  if (request.mode === 'navigate') {
    event.respondWith(page(request))
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(asset(request))
  } else if (url.pathname !== '/sw.js') {
    event.respondWith(other(request))
  }
})
