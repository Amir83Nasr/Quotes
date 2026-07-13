"use client"

import { useState, useTransition, useDeferredValue, useMemo } from "react"
import { Loader2 } from "lucide-react"

/** Build a large list once, filtered on each keystroke to simulate heavy work. */
const ITEMS = Array.from({ length: 8000 }, (_, i) => `Item ${i} — widget component`)

/**
 * Live demo for the useTransition / useDeferredValue lesson.
 *
 * Typing updates the input immediately (urgent), while the expensive filtered
 * list is a deferred/transition update. The input never stutters even though
 * the list re-renders thousands of rows.
 */
export function UseTransitionDemo() {
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [committed, setCommitted] = useState("")

  const deferredQuery = useDeferredValue(committed)

  const results = useMemo(() => {
    const q = deferredQuery.toLowerCase()
    // Artificial cost so the deferral is observable.
    return ITEMS.filter((item) => item.toLowerCase().includes(q)).slice(0, 100)
  }, [deferredQuery])

  function onChange(value: string) {
    setQuery(value) // urgent — keeps the input snappy
    startTransition(() => setCommitted(value)) // non-urgent — the heavy filter
  }

  const isStale = query !== deferredQuery

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter 8,000 items — type fast"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {(isPending || isStale) && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      <ul
        className={
          "mt-3 max-h-48 space-y-1 overflow-y-auto rounded-md border p-2 text-sm transition-opacity " +
          (isStale ? "opacity-50" : "opacity-100")
        }
      >
        {results.map((item) => (
          <li key={item} className="truncate px-1 py-0.5 text-muted-foreground">
            {item}
          </li>
        ))}
        {results.length === 0 && (
          <li className="px-1 py-0.5 text-muted-foreground">No matches</li>
        )}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        The input stays responsive while the list lags behind and dims — that
        gap is the transition keeping typing urgent and filtering deferred.
      </p>
    </div>
  )
}
