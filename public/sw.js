/* ── Quotes PWA Service Worker ───────────────────────────────────────────
 *   Version: 1.0.0
 *   Strategy: cache-first for static/font/image assets,
 *             network-first for navigation pages with offline fallback.
 * ────────────────────────────────────────────────────────────────────── */

const SW_VERSION = "1.0.0"
const CACHE_NAMES = {
  static: `static-assets-${SW_VERSION}`,
  pages: `pages-${SW_VERSION}`,
  fonts: `fonts-${SW_VERSION}`,
  images: `images-${SW_VERSION}`,
}

const OFFLINE_URL = "/offline.html"

// ── Install ───────────────────────────────────────────────────────────
// Precache the offline fallback page so it's always available.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      return cache.add(OFFLINE_URL)
    })
  )
  // Activate immediately — don't wait for old SW to close.
  self.skipWaiting()
})

// ── Activate ──────────────────────────────────────────────────────────
// Delete any caches from a previous SW version.
self.addEventListener("activate", (event) => {
  const validCaches = new Set(Object.values(CACHE_NAMES))

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => !validCaches.has(key))
            .map((key) => caches.delete(key))
        )
      })
      .then(() => {
        // Take control of all clients immediately.
        return self.clients.claim()
      })
  )
})

// ── Fetch ─────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests.
  if (request.method !== "GET") return

  // ── Same-origin requests ──────────────────────────────
  if (url.origin === self.location.origin) {
    // Next.js static build output — immutable hashed files, cache-first.
    if (url.pathname.startsWith("/_next/static/")) {
      event.respondWith(cacheFirst(request, CACHE_NAMES.static))
      return
    }

    // Public images — cache-first.
    if (
      url.pathname.startsWith("/icons/") ||
      url.pathname.startsWith("/screenshots/") ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/)
    ) {
      event.respondWith(cacheFirst(request, CACHE_NAMES.images))
      return
    }

    // Navigation requests (HTML pages) — network-first with offline fallback.
    if (request.mode === "navigate") {
      event.respondWith(networkFirstWithFallback(request, CACHE_NAMES.pages))
      return
    }

    // Static public files (robots.txt, sitemap.xml, etc.)
    if (
      url.pathname === "/offline.html" ||
      url.pathname === "/robots.txt" ||
      url.pathname === "/sitemap.xml"
    ) {
      event.respondWith(cacheFirst(request, CACHE_NAMES.static))
      return
    }

    return
  }

  // ── Third-party requests ─────────────────────────────
  // Google Fonts — cache-first (slow CDN, static content).
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.fonts))
    return
  }
})

// ── Caching Strategies ────────────────────────────────────────────────

/**
 * Cache-first: serve from cache if available, fetch and cache otherwise.
 * Best for immutable assets.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(cacheName)
    // Don't block on cache put.
    cache.put(request, response.clone()).catch(() => {})
  }
  return response
}

/**
 * Network-first: try the network, fall back to cache, fall back to offline page.
 * Best for HTML pages that may have updates.
 */
async function networkFirstWithFallback(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone()).catch(() => {})
      return response
    }
    // Server error — try cache.
    throw new Error(`Server returned ${response.status}`)
  } catch {
    // Network or server failure — try cache.
    const cached = await caches.match(request)
    if (cached) return cached

    // Nothing cached — show offline fallback.
    return caches.match(OFFLINE_URL)
  }
}
