"use client"

import { useState, useCallback } from "react"

const STORAGE_KEY = "quotes-progress"

type ProgressMap = Record<string, boolean>

interface ProgressReturn {
  progress: ProgressMap
  markCompleted: (path: string) => void
  isCompleted: (path: string) => boolean
  completedCount: number
}

/** Read persisted progress — used as lazy state initializer. */
function getInitialProgress(): ProgressMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as ProgressMap
  } catch {
    // localStorage unavailable (SSR, private browsing)
  }
  return {}
}

/**
 * Track completed lessons via localStorage.
 * Persists across sessions with no backend required.
 *
 * Uses lazy useState initializer so no hydration effect is needed.
 */
export function useProgress(): ProgressReturn {
  const [progress, setProgress] = useState<ProgressMap>(getInitialProgress)

  const markCompleted = useCallback((path: string) => {
    setProgress((prev) => {
      const next = { ...prev, [path]: true }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // quota exceeded or unavailable
      }
      return next
    })
  }, [])

  const isCompleted = useCallback(
    (path: string) => !!progress[path],
    [progress]
  )

  return {
    progress,
    markCompleted,
    isCompleted,
    completedCount: Object.values(progress).filter(Boolean).length,
  }
}
