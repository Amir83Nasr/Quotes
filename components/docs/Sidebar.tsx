"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/hooks/use-sidebar"
import { usePathname } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import type { NavItem } from "@/types/navigation"
import { ProgressBadge } from "./ProgressBadge"
import { useProgress } from "@/hooks/use-progress"
import { useResizableSidebar } from "@/hooks/use-resizable-sidebar"

interface SidebarProps {
  groups: { label: string; items: NavItem[] }[]
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
}

/**
 * Compute active / expanded state for a nav item tree based on current pathname.
 */
function enrichActiveState(items: NavItem[], currentPath: string): NavItem[] {
  return items.map((item) => {
    const isActive = item.href !== "#" && item.href === currentPath
    const children = item.children ? enrichActiveState(item.children, currentPath) : undefined
    const isExpanded = isActive || (children ? children.some((c) => c.isActive || c.isExpanded) : false)
    return { ...item, isActive, isExpanded, children }
  })
}

function SidebarLink({ item, isCompleted }: { item: NavItem; isCompleted: (href: string) => boolean }) {
  if (item.children && item.children.length > 0) {
    return <SidebarGroup item={item} isCompleted={isCompleted} />
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        item.isActive
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
      )}
      style={{ paddingLeft: `${item.depth * 16 + 12}px` }}
    >
      <span className="flex-1 truncate">{item.title}</span>
      <div className="flex items-center gap-1.5">
        {item.difficulty && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none",
              DIFFICULTY_COLORS[item.difficulty],
            )}
          >
            {item.difficulty === "beginner" ? "B" : item.difficulty === "intermediate" ? "I" : "A"}
          </span>
        )}
        <ProgressBadge completed={isCompleted(item.href)} />
      </div>
    </Link>
  )
}

function SidebarGroup({ item, isCompleted }: { item: NavItem; isCompleted: (href: string) => boolean }) {
  const [expanded, setExpanded] = useState(item.isExpanded)
  const toggle = useCallback(() => setExpanded((e) => !e), [])

  // Sync with server isExpanded when navigating (auto-expand parent groups)
  useEffect(() => {
    setExpanded(item.isExpanded)
  }, [item.isExpanded])

  return (
    <div>
      <button
        onClick={toggle}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
        )}
        style={{ paddingLeft: `${item.depth * 16 + 12}px` }}
      >
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            expanded ? "rotate-0" : "-rotate-90",
          )}
        />
        <span>{item.title}</span>
      </button>

      {expanded && item.children && (
        <div className="mt-0.5">
          {item.children.map((child, i) => (
            <SidebarLink key={child.href + i} item={child} isCompleted={isCompleted} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ groups }: SidebarProps) {
  const pathname = usePathname()
  const { state, close } = useSidebar()
  const { isCompleted } = useProgress()
  const { width, isResizing, handleMouseDown } = useResizableSidebar()

  // Enrich server-provided items with client-side active/expanded state
  const enriched = groups.map((g) => ({
    ...g,
    items: enrichActiveState(g.items, pathname),
  }))

  return (
    <>
      {/* Desktop sidebar — sticky, scrolls independently */}
      <aside
        className={cn(
          "relative hidden shrink-0 grow-0 border-r bg-background md:block",
          "sticky top-0 h-screen overflow-y-auto",
          !state.isOpen && "md:hidden",
        )}
        style={{ width }}
      >
        <nav className="space-y-0.5 px-2 py-4" role="navigation">
          {enriched.map((group) => (
            <div key={group.label} className="mb-3">
              <div className="flex items-center gap-2 px-3 pb-1 pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              {group.items.map((item, i) => (
                <SidebarLink key={item.href + i} item={item} isCompleted={isCompleted} />
              ))}
            </div>
          ))}
        </nav>

        {/* Drag resize handle */}
        <div
          className={cn(
            "absolute right-0 top-0 z-10 h-full w-1.5 translate-x-1/2 cursor-col-resize transition-colors",
            isResizing
              ? "bg-primary/40"
              : "hover:bg-border",
          )}
          onMouseDown={handleMouseDown}
        />
      </aside>

      {/* Mobile sheet backdrop */}
      {state.isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform md:hidden",
          state.isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold">Navigation</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={close}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)] py-4">
          <nav className="space-y-0.5 px-2">
            {enriched.map((group) => (
              <div key={group.label} className="mb-3">
                <div className="flex items-center gap-2 px-3 pb-1 pt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                {group.items.map((item, i) => (
                  <SidebarLink key={item.href + i} item={item} isCompleted={isCompleted} />
                ))}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}
