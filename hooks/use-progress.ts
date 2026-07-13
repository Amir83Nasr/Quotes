"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "quotes-progress"

type ProgressMap = Record<string, boolean>

interface ProgressReturn {
  progress: ProgressMap
  markCompleted: (path: string) => void
  isCompleted: (path: string) => boolean
  completedCount: number
}

/**
 * Track completed lessons via localStorage.
 * Persists across sessions with no backend required.
 */
export function useProgress(): ProgressReturn {
  const [progress, setProgress] = useState<ProgressMap>({})

  // Load persisted progress on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setProgress(JSON.parse(stored) as ProgressMap)
    } catch {
      // localStorage unavailable (SSR, private browsing)
    }
  }, [])

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
    [progress],
  )

  return {
    progress,
    markCompleted,
    isCompleted,
    completedCount: Object.values(progress).filter(Boolean).length,
  }
}
