"use client"

import { useCallback, useRef, useEffect, useState, lazy, Suspense } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Lazy-load CodeMirror heavy bundle
const CodeMirrorEditor = lazy(() => import("./CodeMirrorEditor"))

interface LiveEditorProps {
  code: string
  onChange?: (code: string) => void
  language?: "javascript" | "typescript" | "html" | "css" | "tsx" | "jsx"
  readOnly?: boolean
  height?: number
  className?: string
}

export function LiveEditor({
  code,
  onChange,
  language = "typescript",
  readOnly = false,
  height = 200,
  className,
}: LiveEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border bg-muted/30",
          className,
        )}
        style={{ height }}
      >
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "flex items-center justify-center rounded-lg border bg-muted/30",
            className,
          )}
          style={{ height }}
        >
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CodeMirrorEditor
        code={code}
        onChange={onChange}
        language={language}
        readOnly={readOnly}
        height={height}
        className={className}
      />
    </Suspense>
  )
}
