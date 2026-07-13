"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Route-level error UI for the docs segment. Next.js renders this when a
 * server component in the segment throws during rendering.
 */
export default function DocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500" />
      <h2 className="text-xl font-semibold">Failed to load this page</h2>
      <p className="text-sm text-muted-foreground">
        {error.message ||
          "An unexpected error occurred while rendering this lesson."}
      </p>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  )
}
