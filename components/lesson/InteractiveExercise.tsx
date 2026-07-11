"use client"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Lightbulb, RotateCcw, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LiveEditor } from "./LiveEditor"
import { SandboxPreview } from "./SandboxPreview"

interface InteractiveExerciseProps {
  title: string
  description: string
  starterCode: string
  language?: "javascript" | "typescript" | "html" | "css" | "tsx" | "jsx"
  solutionCode?: string
  hints?: string[]
  previewType?: "html" | "css" | "javascript" | "mixed"
  previewHtml?: string
  previewCss?: string
  /** Called when user clicks "Check" — return true to mark complete */
  onValidate?: (code: string) => boolean | Promise<boolean>
  /** Persistence key for use-progress */
  lessonPath?: string
  onComplete?: () => void
  className?: string
}

export function InteractiveExercise({
  title,
  description,
  starterCode,
  language = "tsx",
  solutionCode,
  hints,
  previewType = "mixed",
  previewHtml,
  previewCss,
  onValidate,
  lessonPath,
  onComplete,
  className,
}: InteractiveExerciseProps) {
  const [code, setCode] = useState(starterCode)
  const [showHints, setShowHints] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info"
    message: string
  } | null>(null)
  const [completed, setCompleted] = useState(false)
  const [validating, setValidating] = useState(false)

  const handleReset = useCallback(() => {
    setCode(starterCode)
    setFeedback(null)
    setShowSolution(false)
    setShowHints(false)
    setHintIndex(0)
  }, [starterCode])

  const handleCheck = useCallback(async () => {
    if (onValidate) {
      setValidating(true)
      try {
        const passed = await onValidate(code)
        if (passed) {
          setFeedback({ type: "success", message: "Correct! Well done." })
          setCompleted(true)
          onComplete?.()
        } else {
          setFeedback({
            type: "error",
            message: "Not quite right. Check your code and try again.",
          })
        }
      } catch {
        setFeedback({ type: "error", message: "Error validating solution." })
      } finally {
        setValidating(false)
      }
    } else {
      // No validator — manual completion
      setCompleted(true)
      setFeedback({ type: "success", message: "Marked as complete!" })
      onComplete?.()
    }
  }, [code, onValidate, onComplete])

  const nextHint = useCallback(() => {
    if (hints && hintIndex < hints.length - 1) {
      setHintIndex((i) => i + 1)
    }
  }, [hints, hintIndex])

  return (
    <Card className={cn("my-6", className, completed && "ring-1 ring-green-500/50")}>
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className={cn("h-4 w-4", completed ? "text-green-500" : "text-amber-500")} />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {completed && (
              <Badge variant="outline" className="gap-1 border-green-500/30 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Done
              </Badge>
            )}
            <Badge variant="secondary">Exercise</Badge>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Live editor */}
        <LiveEditor
          code={code}
          onChange={setCode}
          language={language}
          height={180}
        />

        {/* Live preview */}
        <SandboxPreview
          html={previewHtml || code}
          css={previewCss}
          js={previewType === "javascript" ? code : ""}
          type={previewType}
          title="Preview"
          height={200}
        />

        {/* Hints */}
        {hints && hints.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowHints(!showHints)
                setHintIndex(0)
              }}
              className="gap-1"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {showHints ? "Hide hints" : "Need a hint?"}
            </Button>
            {showHints && (
              <div className="mt-2 rounded-lg border bg-muted/30 p-3">
                <p className="text-sm text-muted-foreground">
                  {hints[hintIndex]}
                </p>
                {hintIndex < hints.length - 1 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1 h-auto p-0 gap-1"
                    onClick={nextHint}
                  >
                    Another hint <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div
            className={cn(
              "rounded-lg border p-3 text-sm",
              feedback.type === "success" &&
                "border-green-500/30 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
              feedback.type === "error" &&
                "border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
              feedback.type === "info" &&
                "border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
            )}
          >
            {feedback.message}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
        <Button size="sm" onClick={handleCheck} disabled={validating || completed}>
          {validating ? "Checking..." : completed ? "Completed" : "Check my answer"}
        </Button>

        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1">
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>

        {solutionCode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? "Hide solution" : "View solution"}
          </Button>
        )}
      </CardFooter>

      {showSolution && solutionCode && (
        <CardContent className="border-t pt-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Solution</span>
          </div>
          <LiveEditor
            code={solutionCode}
            language={language}
            height={160}
            readOnly
          />
        </CardContent>
      )}
    </Card>
  )
}
