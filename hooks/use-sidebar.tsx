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
  const [userWantsOpen, setUserWantsOpen] = useState(!isMobile)

  // `useState(!isMobile)` handles the default per device:
  //   desktop → open (userWantsOpen = true)
  //   mobile  → closed (userWantsOpen = false)
  // The toggle/close/open callbacks let the user override at any time.
  const isOpen = userWantsOpen

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
