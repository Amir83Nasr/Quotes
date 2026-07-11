"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const STORAGE_KEY = "sidebar-width"
const MIN_WIDTH = 180
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 256

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
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(DEFAULT_WIDTH)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = Number.parseInt(stored, 10)
        if (!Number.isNaN(parsed)) {
          setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed)))
        }
      }
    } catch {
      // localStorage unavailable
    }
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = startWidthRef.current + (e.clientX - startXRef.current)
    setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)))
  }, [])

  const widthRef = useRef(width)
  widthRef.current = width

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
    document.body.style.userSelect = ""
    document.body.style.cursor = ""

    // Persist final width
    try {
      localStorage.setItem(STORAGE_KEY, String(widthRef.current))
    } catch {
      // quota exceeded
    }
  }, [handleMouseMove])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      startXRef.current = e.clientX
      startWidthRef.current = width
      setIsResizing(true)
      document.body.style.userSelect = "none"
      document.body.style.cursor = "col-resize"

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [width, handleMouseMove, handleMouseUp],
  )

  return { width, isResizing, handleMouseDown }
}
