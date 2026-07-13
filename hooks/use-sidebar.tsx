"use client"

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useState,
  useCallback,
  useMemo,
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
 * Synchronous media query check — avoids the flash caused by
 * useState(false) → useEffect(fire) on mobile.
 */
function useIsMobile() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(max-width: 768px)")
      mq.addEventListener("change", callback)
      return () => mq.removeEventListener("change", callback)
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    // Server fallback — assume desktop (sidebar open)
    () => false
  )
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [userWantsOpen, setUserWantsOpen] = useState(!isMobile)

  // Mobile overrides user preference: always closed on mobile, open on desktop.
  // Derived during render — no effect or ref needed.
  const isOpen = !isMobile && userWantsOpen

  const toggle = useCallback(() => setUserWantsOpen((v) => !v), [])
  const open = useCallback(() => setUserWantsOpen(true), [])
  const close = useCallback(() => setUserWantsOpen(false), [])

  const state: SidebarState = useMemo(
    () => ({ isOpen, isCollapsed: false }),
    [isOpen]
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
