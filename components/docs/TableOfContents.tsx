"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { TocHeading } from "@/types/navigation"

interface TableOfContentsProps {
  headings: TocHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      className="sticky top-20 hidden w-56 shrink-0 xl:block"
      aria-label="Table of contents"
    >
      <div className="overflow-y-auto py-8 pr-4">
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          On this page
        </h3>
        <ul className="space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block text-sm transition-colors",
                  activeId === heading.id
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
