"use client"

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react"
import type { SidebarState } from "@/types/navigation"

type SidebarContextType = {
  state: SidebarState
  toggle: () => void
  open: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

/**
 * Media query hook — uses useSyncExternalStore for tear-free reads.
 * Server fallback assumes desktop (matchClient = false).
 */
function useIsMobile() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(max-width: 1023px)")
      mq.addEventListener("change", callback)
      return () => mq.removeEventListener("change", callback)
    },
    () => window.matchMedia("(max-width: 1023px)").matches,
    // Server fallback — assume desktop (sidebar open)
    () => false
  )
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  // Start with sidebar open as SSR default (desktop assumption).
  // A ref prevents the mount-effect from overriding explicit user toggles
  // on subsequent resize events.
  const [userWantsOpen, setUserWantsOpen] = useState(true)
  const initialized = useRef(false)

  // On mount (post-hydration), sync to actual device.
  // On subsequent isMobile changes (resize), no-op once initialized —
  // user's explicit toggle must be respected.
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      setUserWantsOpen(!isMobile)
    }
  }, [isMobile])

  const toggle = useCallback(() => setUserWantsOpen((v) => !v), [])
  const open = useCallback(() => setUserWantsOpen(true), [])
  const close = useCallback(() => setUserWantsOpen(false), [])

  const state: SidebarState = useMemo(
    () => ({ isOpen: userWantsOpen, isCollapsed: false }),
    [userWantsOpen]
  )

  return (
    <SidebarContext.Provider value={{ state, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}
