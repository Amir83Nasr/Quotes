"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressBadgeProps {
  completed: boolean
  className?: string
}

/**
 * Small checkmark circle shown next to completed lessons in the sidebar.
 */
export function ProgressBadge({ completed, className }: ProgressBadgeProps) {
  if (!completed) return null

  return (
    <span
      className={cn(
        "ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500",
        className,
      )}
    >
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}
