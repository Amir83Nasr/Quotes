"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, FileText, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/navigation"

interface SearchProps {
  items: NavItem[]
  className?: string
}

/**
 * Command-palette style search dialog.
 * Filters sidebar items by title.
 */
export function Search({ items, className }: SearchProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Flatten nav tree for search
  const flatItems = flatten(items)

  const results = query.trim()
    ? flatItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : flatItems.slice(0, 5)

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  // Reset query and focus input on dialog open/close (event handler, not effect)
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery("")
    } else {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [])

  const navigate = useCallback(
    (href: string) => {
      setOpen(false)

      const [path, hash] = href.split("#")
      const targetPath = path || window.location.pathname
      const samePage = targetPath === window.location.pathname

      if (!hash) {
        router.push(href)
        return
      }

      // Scroll to the heading once it's present in the DOM. On a cross-page
      // navigation we retry for a short window while the new page mounts.
      const scrollToHash = () => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
          return true
        }
        return false
      }

      if (samePage) {
        scrollToHash()
        return
      }

      router.push(href)

      let attempts = 0
      const tick = () => {
        if (scrollToHash() || attempts > 40) return
        attempts++
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    [router]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "relative h-9 w-full justify-start text-sm text-muted-foreground md:w-56 lg:w-80",
            className
          )}
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          <span>Search lessons...</span>
          <kbd className="pointer-events-none absolute top-1/2 right-1.5 hidden -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none md:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle className="sr-only">Search lessons</DialogTitle>
        <div className="flex items-center border-b pb-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-2 max-h-64 overflow-y-auto">
          {results.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No results found
            </p>
          )}
          {results.map((item, i) => (
            <button
              key={`${i}-${item.href}`}
              onClick={() => navigate(item.href)}
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{item.title}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function flatten(items: NavItem[]): NavItem[] {
  const result: NavItem[] = []
  for (const item of items) {
    result.push({ ...item, children: undefined })
    if (item.children) result.push(...flatten(item.children))
  }
  return result
}
