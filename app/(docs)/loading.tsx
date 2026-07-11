import { Loader2 } from "lucide-react"

/** Route-level loading UI for the docs segment. */
export default function DocsLoading() {
  return (
    <div className="flex w-full items-center justify-center px-6 py-24">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
