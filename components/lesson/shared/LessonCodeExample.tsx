"use client"

import { useCallback } from "react"
import { Code, Play, Copy, Check, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "./CodeBlock"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import dynamic from "next/dynamic"

// Lazy-load heavy dependencies
const SandboxPreview = dynamic(
  () =>
    import("../interactive/SandboxPreview").then((m) => ({
      default: m.SandboxPreview,
    })),
  { ssr: false }
)

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
  /** Show live preview via iframe */
  preview?: boolean
  /** Preview type forwarded to SandboxPreview */
  previewType?: "html" | "css" | "javascript" | "mixed"
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
  preview = false,
  previewType,
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

      {/* ── Live preview ── */}
      {preview && (
        <div className="border-t">
          <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Eye className="h-3 w-3" />
              Output
            </span>
          </div>
          <SandboxPreview
            html={code}
            type={
              previewType ??
              (language === "css"
                ? "css"
                : language === "javascript" || language === "js"
                  ? "javascript"
                  : "mixed")
            }
            height={280}
            className="my-0 rounded-none border-0"
          />
        </div>
      )}

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
