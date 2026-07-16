"use client"

import { useState, useEffect, useCallback } from "react"
import { WifiOff } from "lucide-react"

/**
 * Displays a subtle banner when the user goes offline.
 *
 * Uses the native `navigator.onLine` property and `online`/`offline`
 * events.  Shows a thin fixed banner at the bottom of the viewport.
 */
export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine === false
  )

  const handleOnline = useCallback(() => setIsOffline(false), [])
  const handleOffline = useCallback(() => setIsOffline(true), [])

  useEffect(() => {
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [handleOnline, handleOffline])

  if (!isOffline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="text-destructive-foreground fixed inset-x-0 bottom-0 z-50 flex animate-in items-center justify-center gap-2 bg-destructive px-4 py-2 text-sm font-medium shadow-lg slide-in-from-bottom"
    >
      <WifiOff className="h-4 w-4" />
      <span>
        You&apos;re offline — previously viewed pages are still available
      </span>
    </div>
  )
}
