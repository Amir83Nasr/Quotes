"use client"

import { useState, useCallback } from "react"
import { Code, Play, Eye, FileText, Copy, Check, RotateCcw, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "./CodeBlock"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import dynamic from "next/dynamic"

// Lazy-load SandboxPreview — pulls in iframe logic, not CodeMirror
const SandboxPreview = dynamic(
  () => import("../interactive/SandboxPreview").then((m) => ({ default: m.SandboxPreview })),
  { ssr: false },
)

interface LessonCodeExampleProps {
  /** Source code to display in the editor */
  code: string
  /** Language for syntax highlighting (tsx, javascript, css, html, bash, etc.) */
  language?: string
  /** Optional header title */
  title?: string
  /** Show live preview tab? Requires SandboxPreview lazy-import. */
  preview?: boolean
  /** Show run button in action bar */
  executable?: boolean
  /** Collapsible explanation text (plain markdown — rendered as text) */
  explanation?: string
  /** Initial console output shown in the Output panel */
  initialOutput?: string
  /** Show line numbers in code block */
  showLineNumbers?: boolean
  /** Extra content for explanation panel */
  children?: React.ReactNode
  /** Additional class name */
  className?: string
}

type TabId = "code" | "output" | "explanation"

/**
 * Interactive lesson code example with tabbed panels.
 *
 * Shows a syntax-highlighted code block, optional live preview iframe,
 * console output, and collapsible explanation — all in one responsive widget.
 */
export function LessonCodeExample({
  code,
  language = "tsx",
  title,
  preview = false,
  executable = false,
  explanation,
  initialOutput,
  showLineNumbers = false,
  children,
  className,
}: LessonCodeExampleProps) {
  const { copied, copy } = useCopyToClipboard()
  const [activeTab, setActiveTab] = useState<TabId>("code")
  const [output, setOutput] = useState(initialOutput ?? "")
  const [showExplanation, setShowExplanation] = useState(false)
  const [codeKey, setCodeKey] = useState(0)
  const [previewKey, setPreviewKey] = useState(0)

  // Reset code and preview to initial state
  const handleReset = useCallback(() => {
    setCodeKey((k) => k + 1)
    setPreviewKey((k) => k + 1)
    setOutput(initialOutput ?? "")
  }, [initialOutput])

  const handleCopy = useCallback(() => copy(code), [code, copy])

  const handleRun = useCallback(() => {
    setOutput("// Running code…")
    // Execute code in a sandboxed context and capture console.log output
    try {
      const logs: string[] = []
      const mockConsole = {
        log: (...args: unknown[]) =>
          logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")),
        error: (...args: unknown[]) =>
          logs.push(`%cerror%c ${args.map((a) => String(a)).join(" ")}`),
        warn: (...args: unknown[]) =>
          logs.push(`%cwarn%c ${args.map((a) => String(a)).join(" ")}`),
      }

      const fn = new Function("console", code)
      fn(mockConsole)
      setOutput(logs.length > 0 ? logs.join("\n") : "✓ Code executed successfully (no console output)")
    } catch (e) {
      setOutput(`✗ Error: ${e instanceof Error ? e.message : String(e)}`)
    }
  }, [code])

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "code", label: "Code", icon: <Code className="h-3.5 w-3.5" /> },
    ...(preview ? [{ id: "output" as const, label: "Output", icon: <Eye className="h-3.5 w-3.5" /> }] : []),
    ...((explanation ?? children) ? [{ id: "explanation" as const, label: "Explanation", icon: <FileText className="h-3.5 w-3.5" /> }] : []),
  ]

  const showActionBar = executable || preview

  return (
    <div className={cn("my-6 overflow-hidden rounded-xl border bg-card shadow-sm", className)}>
      {/* Title bar */}
      {title && (
        <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
          <Play className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex border-b bg-muted/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="min-h-0">
        {/* Code tab */}
        {activeTab === "code" && (
          <div key={codeKey}>
            <CodeBlock
              code={code}
              language={language}
              showLineNumbers={showLineNumbers}
              className="my-0 rounded-none border-0 shadow-none"
            />
          </div>
        )}

        {/* Output tab — live preview */}
        {activeTab === "output" && preview && (
          <div key={previewKey}>
            <SandboxPreview
              html={code}
              type={language === "css" ? "css" : language === "javascript" || language === "js" ? "javascript" : "mixed"}
              height={280}
            />
          </div>
        )}

        {/* Explanation tab */}
        {activeTab === "explanation" && (
          <div className="px-4 py-4">
            {explanation && (
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <p>{explanation}</p>
              </div>
            )}
            {children}
          </div>
        )}
      </div>

      {/* Action bar */}
      {showActionBar && (
        <div className="flex items-center justify-between border-t bg-muted/20 px-3 py-2">
          {/* Left — action buttons */}
          <div className="flex items-center gap-1">
            {executable && (
              <button
                onClick={handleRun}
                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Play className="h-3 w-3" />
                Run
              </button>
            )}
            {preview && (
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                <RotateCcw className="h-3 w-3" />
                Refresh
              </button>
            )}
          </div>

          {/* Right — utility buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              aria-label={copied ? "Copied" : "Copy code"}
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>

            {executable && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Console output (when present) */}
      {output && executable && (
        <div className="border-t bg-[#1e1e1e] dark:bg-black/80">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-1.5">
            <Code className="h-3 w-3 text-green-400" />
            <span className="text-[11px] font-medium text-green-400">Console</span>
          </div>
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-green-400 [font-family:var(--font-mono,monospace)]">
            {output.split("\n").map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line.startsWith("%c") ? (
                  <>
                    <span className="text-red-400">error</span>
                    {line.slice(line.indexOf(" ", 2))}
                  </>
                ) : line.startsWith("✗") ? (
                  <span className="text-red-400">{line}</span>
                ) : line.startsWith("✓") ? (
                  <span className="text-green-400">{line}</span>
                ) : (
                  line
                )}
              </div>
            ))}
          </pre>
        </div>
      )}

      {/* Collapsible explanation (mobile-friendly, always visible) */}
      {(explanation ?? children) && activeTab !== "explanation" && (
        <div className="border-t">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Explanation</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                showExplanation && "rotate-180",
              )}
            />
          </button>
          {showExplanation && (
            <div className="border-t bg-muted/20 px-4 py-3">
              {explanation && (
                <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                  <p>{explanation}</p>
                </div>
              )}
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
