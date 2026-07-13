"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const STORAGE_KEY = "sidebar-width"
const MIN_WIDTH = 180
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 256

function getStoredWidth(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = Number.parseInt(stored, 10)
      if (!Number.isNaN(parsed)) {
        return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed))
      }
    }
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_WIDTH
}

interface UseResizableSidebarReturn {
  width: number
  isResizing: boolean
  handleMouseDown: (e: React.MouseEvent) => void
}

/**
 * Persist sidebar width to localStorage, clamp within [180, 400].
 * Attaches global mousemove/mouseup on drag start.
 */
export function useResizableSidebar(): UseResizableSidebarReturn {
  const [width, setWidth] = useState(getStoredWidth)
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(DEFAULT_WIDTH)
  const widthRef = useRef(width)

  // Keep ref in sync with state so handlers always read latest width
  useEffect(() => {
    widthRef.current = width
  }, [width])

  // Attach/remove global mouse listeners during resize
  useEffect(() => {
    if (!isResizing) return

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidthRef.current + (e.clientX - startXRef.current)
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)))
    }

    const onMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""

      try {
        localStorage.setItem(STORAGE_KEY, String(widthRef.current))
      } catch {
        // quota exceeded
      }
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [isResizing])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      startXRef.current = e.clientX
      startWidthRef.current = width
      setIsResizing(true)
      document.body.style.userSelect = "none"
      document.body.style.cursor = "col-resize"
    },
    [width]
  )

  return { width, isResizing, handleMouseDown }
}
