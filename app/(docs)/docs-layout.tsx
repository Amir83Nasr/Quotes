"use client"

import { Suspense } from "react"
import { Sidebar } from "@/components/docs/Sidebar"
import { ErrorBoundary } from "@/components/ErrorBoundary"

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
      <Suspense fallback={<div className="w-64 shrink-0 border-r" />}>
        <Sidebar groups={groups} />
      </Suspense>
      <main className="min-w-0 flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  )
}
