"use client"

import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

/** Shared difficulty → badge-color map used by challenge cards. */
export const difficultyColors = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
} as const

/** Canonical difficulty scale used across content frontmatter and widgets. */
export type Difficulty = keyof typeof difficultyColors

interface ChecklistProps {
  items: string[]
  completed: string[]
  onToggle: (item: string) => void
  title?: string
}

/**
 * Toggleable requirements checklist shared by static and interactive challenges.
 * Each item is a checkbox button; completed items are struck through.
 */
export function Checklist({ items, completed, onToggle, title }: ChecklistProps) {
  return (
    <div>
      {title && <h4 className="mb-2 text-sm font-medium">{title}</h4>}
      <ul className="space-y-1.5">
        {items.map((item, i) => {
          const done = completed.includes(item)
          return (
            <li key={i}>
              <button
                onClick={() => onToggle(item)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-accent/50",
                  done && "text-muted-foreground line-through",
                )}
                aria-checked={done}
                role="checkbox"
              >
                <CheckCircle2
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    done ? "text-green-500" : "text-muted-foreground/30",
                  )}
                />
                {item}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
