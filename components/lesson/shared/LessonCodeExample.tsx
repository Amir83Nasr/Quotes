"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Code,
  Play,
  Eye,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  Target,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "./CodeBlock"
import { Checklist } from "./Checklist"
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

const LiveEditor = dynamic(
  () =>
    import("../interactive/LiveEditor").then((m) => ({
      default: m.LiveEditor,
    })),
  { ssr: false }
)

type PreviewType = "html" | "css" | "javascript" | "mixed"

function normalizeLanguage(lang?: string): string {
  if (!lang) return "tsx"
  const map: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    jsx: "javascript",
    tsx: "typescript",
  }
  return map[lang] ?? lang
}

// ── Props ──

interface LessonCodeExampleProps {
  /** Source code to display/execute */
  code: string
  /** Language for syntax highlighting */
  language?: string
  /** Optional header title */
  title?: string
  /** Extra class name */
  className?: string

  // Demo mode features
  /** Show live preview tab */
  preview?: boolean
  /** Show run button + console output */
  executable?: boolean
  /** Collapsible explanation text */
  explanation?: string
  /** Initial console output */
  initialOutput?: string
  /** Show line numbers in code block */
  showLineNumbers?: boolean
  /** Extra content */
  children?: React.ReactNode

  // ── Challenge mode ──
  /**
   * "demo" — static code block with optional tabs (default)
   * "challenge" — editable code, requirements, hints, validate, solution
   */
  mode?: "demo" | "challenge"
  /** Optional solution code to reveal */
  solution?: string
  /** Progressive hints (shown one at a time) */
  hints?: string[]
  /** Requirements checklist items */
  requirements?: string[]
  /** Type of sandbox preview to render */
  previewType?: PreviewType
  /** Additional CSS for the sandbox preview */
  previewCss?: string
  /** Auto-execute on mount */
  autoRun?: boolean

  // ── Layout ──
  /**
   * "tabs" — switch between code/output tabs
   * "split" — code + output side-by-side on desktop (default for challenge)
   */
  layout?: "tabs" | "split"
}

type TabId = "code" | "output" | "explanation"

/**
 * Interactive lesson code widget with two modes:
 *
 * **Demo mode** (default): syntax-highlighted code block with optional tabs
 * for output preview, explanation, and run/reset/copy actions.
 *
 * **Challenge mode**: editable code area with requirements checklist, hints,
 * live preview, validate, and solution reveal.
 */
export function LessonCodeExample({
  code,
  language = "tsx",
  title,
  className,
  // Demo features
  preview = false,
  executable = false,
  explanation,
  initialOutput,
  showLineNumbers = false,
  children,
  // Challenge mode
  mode = "demo",
  solution,
  hints,
  requirements,
  previewType,
  previewCss,
  autoRun = false,
  // Layout
  layout: layoutProp,
}: LessonCodeExampleProps) {
  const { copied, copy } = useCopyToClipboard()
  const normLang = normalizeLanguage(language)

  // Demo mode state
  const [activeTab, setActiveTab] = useState<TabId>("code")
  const [showExplanation, setShowExplanation] = useState(false)
  const [codeKey, setCodeKey] = useState(0)
  const [previewKey, setPreviewKey] = useState(0)

  // Challenge mode state
  const [challengeCode, setChallengeCode] = useState(code)
  const [completedRequirements, setCompletedRequirements] = useState<string[]>(
    []
  )
  const [showHints, setShowHints] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info"
    message: string
  } | null>(null)
  const [completed, setCompleted] = useState(false)
  const [validating, setValidating] = useState(false)
  const [output, setOutput] = useState(initialOutput ?? "")

  const isChallenge = mode === "challenge"
  const isSplit =
    layoutProp === "split" || (isChallenge && layoutProp !== "tabs")

  // Reset demo mode
  const handleResetDemo = useCallback(() => {
    setCodeKey((k) => k + 1)
    setPreviewKey((k) => k + 1)
    setOutput(initialOutput ?? "")
  }, [initialOutput])

  // Reset challenge mode
  const handleResetChallenge = useCallback(() => {
    setChallengeCode(code)
    setCompletedRequirements([])
    setShowHints(false)
    setHintIndex(0)
    setShowSolution(false)
    setFeedback(null)
    setCompleted(false)
    setOutput(initialOutput ?? "")
  }, [code, initialOutput])

  const handleCopy = useCallback(
    () => copy(isChallenge ? challengeCode : code),
    [code, challengeCode, copy, isChallenge]
  )

  // Run code in sandboxed console
  const handleRun = useCallback(() => {
    const targetCode = isChallenge ? challengeCode : code
    setOutput("// Running code…")
    try {
      const logs: string[] = []
      const mockConsole = {
        log: (...args: unknown[]) =>
          logs.push(
            args
              .map((a) =>
                typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
              )
              .join(" ")
          ),
        error: (...args: unknown[]) =>
          logs.push(`%cerror%c ${args.map((a) => String(a)).join(" ")}`),
        warn: (...args: unknown[]) =>
          logs.push(`%cwarn%c ${args.map((a) => String(a)).join(" ")}`),
      }

      const fn = new Function("console", targetCode)
      fn(mockConsole)
      setOutput(
        logs.length > 0
          ? logs.join("\n")
          : "✓ Code executed successfully (no console output)"
      )
    } catch (e) {
      setOutput(`✗ Error: ${e instanceof Error ? e.message : String(e)}`)
    }
  }, [code, challengeCode, isChallenge])

  // Auto-run on mount — defer setState to avoid cascading render warning
  useEffect(() => {
    if (autoRun) {
      const timer = setTimeout(() => handleRun(), 0)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Validate challenge code
  const handleValidate = useCallback(async () => {
    setValidating(true)
    try {
      setFeedback({ type: "success", message: "Challenge complete!" })
      setCompleted(true)
    } catch {
      setFeedback({ type: "error", message: "Error validating solution." })
    } finally {
      setValidating(false)
    }
  }, [])

  const nextHint = useCallback(() => {
    if (hints && hintIndex < hints.length - 1) {
      setHintIndex((i) => i + 1)
    }
  }, [hints, hintIndex])

  // ── Tabs for demo mode ──
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = !isSplit
    ? [
        {
          id: "code",
          label: "Code",
          icon: <Code className="h-3.5 w-3.5" />,
        },
        ...(preview || previewType
          ? [
              {
                id: "output" as const,
                label: "Output",
                icon: <Eye className="h-3.5 w-3.5" />,
              },
            ]
          : []),
        ...((explanation ?? children)
          ? [
              {
                id: "explanation" as const,
                label: "Explanation",
                icon: <FileText className="h-3.5 w-3.5" />,
              },
            ]
          : []),
      ]
    : []

  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-xl border bg-card shadow-sm",
        completed && "ring-1 ring-green-500/50",
        className
      )}
    >
      {/* ── Title bar ── */}
      {(title || isChallenge || completed) && (
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
          <div className="flex items-center gap-2">
            {isChallenge ? (
              <Target className="h-4 w-4 text-rose-500" />
            ) : (
              <Play className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium">
              {title || (mode === "challenge" ? "Challenge" : "Example")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {completed && (
              <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 px-2 py-0.5 text-[11px] font-medium text-green-600 dark:text-green-400">
                <Sparkles className="h-3 w-3" />
                Done
              </span>
            )}
            {isChallenge && (
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                Challenge
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Requirements checklist (challenge mode) ── */}
      {isChallenge && requirements && requirements.length > 0 && (
        <div className="border-b bg-muted/20 px-4 py-3">
          <Checklist
            title="Requirements:"
            items={requirements}
            completed={completedRequirements}
            onToggle={(item) =>
              setCompletedRequirements((prev) =>
                prev.includes(item)
                  ? prev.filter((r) => r !== item)
                  : [...prev, item]
              )
            }
          />
        </div>
      )}

      {/* ── Split layout (desktop: code | preview side-by-side) ── */}
      {isSplit ? (
        <div className="flex flex-col md:flex-row">
          {/* Code panel */}
          <div className="flex min-w-0 flex-1 flex-col border-r max-md:border-b">
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
            {isChallenge ? (
              <LiveEditor
                code={challengeCode}
                onChange={setChallengeCode}
                language={
                  normLang as
                    "javascript" | "typescript" | "html" | "css" | "tsx" | "jsx"
                }
                height={260}
                className="rounded-none border-0"
              />
            ) : (
              <div key={codeKey}>
                <CodeBlock
                  code={code}
                  language={language}
                  showLineNumbers={showLineNumbers}
                  className="my-0 rounded-none border-0 shadow-none"
                />
              </div>
            )}
          </div>

          {/* Output panel */}
          {(preview || previewType) && (
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  Output
                </span>
                <button
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Refresh
                </button>
              </div>
              <SandboxPreview
                key={previewKey}
                html={isChallenge ? challengeCode : code}
                css={previewCss}
                type={previewType ?? "mixed"}
                height={260}
                className="my-0 rounded-none border-0"
              />
            </div>
          )}
        </div>
      ) : (
        /* ── Tabs layout ── */
        <>
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
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="min-h-0">
            {activeTab === "code" && (
              <div key={codeKey}>
                {isChallenge ? (
                  <LiveEditor
                    code={challengeCode}
                    onChange={setChallengeCode}
                    language={
                      normLang as
                        | "javascript"
                        | "typescript"
                        | "html"
                        | "css"
                        | "tsx"
                        | "jsx"
                    }
                    height={220}
                    className="rounded-none border-0"
                  />
                ) : (
                  <CodeBlock
                    code={code}
                    language={language}
                    showLineNumbers={showLineNumbers}
                    className="my-0 rounded-none border-0 shadow-none"
                  />
                )}
              </div>
            )}

            {activeTab === "output" && (preview || previewType) && (
              <div key={previewKey}>
                <SandboxPreview
                  html={isChallenge ? challengeCode : code}
                  css={previewCss}
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

            {activeTab === "explanation" && (
              <div className="px-4 py-4">
                {explanation && (
                  <div className="prose prose-sm max-w-none prose-neutral dark:prose-invert">
                    <p>{explanation}</p>
                  </div>
                )}
                {children}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Console output ── */}
      {output && (
        <div className="border-t bg-[#1e1e1e] dark:bg-black/80">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-1.5">
            <Code className="h-3 w-3 text-green-400" />
            <span className="text-[11px] font-medium text-green-400">
              Console
            </span>
          </div>
          <pre className="overflow-x-auto p-4 [font-family:var(--font-mono,monospace)] text-xs leading-relaxed text-green-400">
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

      {/* ── Action bar ── */}
      {(executable || isChallenge) && (
        <div className="flex items-center justify-between border-t bg-muted/20 px-3 py-2">
          <div className="flex items-center gap-1">
            {(executable || isChallenge) && (
              <button
                onClick={handleRun}
                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Play className="h-3 w-3" />
                Run
              </button>
            )}

            {isChallenge && (
              <button
                onClick={handleValidate}
                disabled={validating || completed}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  completed
                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                    : "bg-primary px-2.5 py-1 text-primary-foreground hover:bg-primary/90"
                )}
              >
                <CheckCircle2 className="h-3 w-3" />
                {validating ? "Checking…" : completed ? "Completed" : "Check"}
              </button>
            )}

            {isChallenge && hints && hints.length > 0 && (
              <button
                onClick={() => {
                  setShowHints(!showHints)
                  setHintIndex(0)
                }}
                className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                <Lightbulb className="h-3 w-3" />
                {showHints ? "Hide hints" : "Hint"}
              </button>
            )}

            <button
              onClick={isChallenge ? handleResetChallenge : handleResetDemo}
              className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>

            {isChallenge && solution && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                {showSolution ? "Hide solution" : "Solution"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Hints panel ── */}
      {isChallenge && showHints && hints && hints.length > 0 && (
        <div className="border-t bg-muted/20 px-4 py-3">
          <p className="text-sm text-muted-foreground">{hints[hintIndex]}</p>
          {hintIndex < hints.length - 1 && (
            <button
              onClick={nextHint}
              className="mt-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Another hint →
            </button>
          )}
        </div>
      )}

      {/* ── Feedback (challenge mode) ── */}
      {isChallenge && feedback && (
        <div
          className={cn(
            "border-t px-4 py-3 text-sm",
            feedback.type === "success" &&
              "border-green-500/30 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
            feedback.type === "error" &&
              "border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
            feedback.type === "info" &&
              "border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
          )}
        >
          {feedback.message}
        </div>
      )}

      {/* ── Solution reveal (challenge mode) ── */}
      {isChallenge && showSolution && solution && (
        <div className="border-t">
          <div className="flex items-center gap-2 border-b bg-muted/20 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Solution</span>
          </div>
          <CodeBlock
            code={solution}
            language={language}
            className="my-0 rounded-none border-0 shadow-none"
          />
        </div>
      )}

      {/* ── Collapsible explanation (demo mode only) ── */}
      {!isChallenge &&
        (explanation ?? children) &&
        activeTab !== "explanation" && (
          <div className="border-t">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Explanation</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  showExplanation && "rotate-180"
                )}
              />
            </button>
            {showExplanation && (
              <div className="border-t bg-muted/20 px-4 py-3">
                {explanation && (
                  <div className="prose prose-sm max-w-none prose-neutral dark:prose-invert">
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
