"use client"

import { useEffect } from "react"

/**
 * Registers the service worker after the page loads.
 *
 * Registration happens on mount (client-side only).  The SW scope is "/"
 * so it intercepts all same-origin requests.
 *
 * Uses a non-blocking approach: the app renders normally even if
 * registration fails.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    // Delay registration until after initial render so the page
    // loads fully before the SW thread starts.
    const id = setTimeout(() => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          // Check for updates on each navigation.
          if (reg.active) {
            reg.update()
          }
        })
        .catch(() => {
          // SW registration failed — app still works as normal web app.
        })
    }, 1000)

    return () => clearTimeout(id)
  }, [])

  return null
}
