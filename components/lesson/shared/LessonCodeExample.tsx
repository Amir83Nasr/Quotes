"use client"

import { useCallback } from "react"
import { Code, Play, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "./CodeBlock"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

// ── Props ──

interface LessonCodeExampleProps {
  /** Source code to display */
  code: string
  /** Language for syntax highlighting */
  language?: string
  /** Optional header title */
  title?: string
  /** Extra class name */
  className?: string
  /** Explanation of what the code does and what output to expect */
  explanation?: string
  /** Extra content below explanation */
  children?: React.ReactNode
}

export function LessonCodeExample({
  code,
  language = "tsx",
  title,
  className,
  explanation,
  children,
}: LessonCodeExampleProps) {
  const { copied, copy } = useCopyToClipboard()
  const handleCopy = useCallback(() => copy(code), [code, copy])

  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
    >
      {/* ── Title bar ── */}
      {title && (
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
      )}

      {/* ── Code section ── */}
      <div>
        <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Code className="h-3 w-3" />
            Code
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <CodeBlock
          code={code}
          language={language}
          showLineNumbers
          className="my-0 rounded-none border-0 shadow-none"
        />
      </div>

      {/* ── Explanation ── */}
      {(explanation || children) && (
        <div className="border-t bg-muted/10 px-4 py-3">
          {explanation && (
            <div className="prose prose-sm max-w-none prose-neutral dark:prose-invert">
              <p>{explanation}</p>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  )
}
