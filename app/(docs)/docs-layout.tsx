"use client"

import { Sidebar } from "@/components/docs/Sidebar"

interface DocsLayoutProps {
  children: React.ReactNode
  groups: { label: string; items: import("@/types/navigation").NavItem[] }[]
}

/**
 * Client wrapper rendering sidebar + main content area.
 * Pages control their own inner layout (TOC, content width).
 */
export function DocsLayout({ children, groups }: DocsLayoutProps) {
  return (
    <div className="flex w-full">
      <Sidebar groups={groups} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
