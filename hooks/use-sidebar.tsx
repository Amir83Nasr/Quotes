"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { SidebarState } from "@/types/navigation"

type SidebarContextType = {
  state: SidebarState
  toggle: () => void
  open: () => void
  close: () => void
}

type MediaQueryHandler = (e: MediaQueryListEvent | MediaQueryList) => void

const SidebarContext = createContext<SidebarContextType | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>({
    isOpen: true,
    isCollapsed: false,
  })

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const handleChange: MediaQueryHandler = (e) => {
      setState((prev) => ({ ...prev, isOpen: !e.matches }))
    }
    handleChange(mq)
    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        state,
        toggle: () =>
          setState((prev) => ({ ...prev, isOpen: !prev.isOpen })),
        open: () => setState((prev) => ({ ...prev, isOpen: true })),
        close: () => setState((prev) => ({ ...prev, isOpen: false })),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}
