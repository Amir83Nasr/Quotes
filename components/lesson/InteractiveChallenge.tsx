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
import {
  Target,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LiveEditor } from "./LiveEditor"
import { SandboxPreview } from "./SandboxPreview"

interface InteractiveChallengeProps {
  title: string
  description: string
  requirements: string[]
  starterCode: string
  language?: "javascript" | "typescript" | "html" | "css" | "tsx" | "jsx"
  solutionCode?: string
  difficulty?: "easy" | "medium" | "hard"
  previewType?: "html" | "css" | "javascript" | "mixed"
  previewHtml?: string
  previewCss?: string
  className?: string
}

const difficultyColors = {
  easy: "bg-green-500/10 text-green-600 dark:text-green-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400",
}

const difficultyEmoji = {
  easy: "★",
  medium: "★★",
  hard: "★★★",
}

export function InteractiveChallenge({
  title,
  description,
  requirements,
  starterCode,
  language = "tsx",
  solutionCode,
  difficulty = "medium",
  previewType = "mixed",
  previewHtml,
  previewCss,
  className,
}: InteractiveChallengeProps) {
  const [code, setCode] = useState(starterCode)
  const [completed, setCompleted] = useState<string[]>([])
  const [showSolution, setShowSolution] = useState(false)
  const [allDone, setAllDone] = useState(false)

  const toggleRequirement = useCallback((req: string) => {
    setCompleted((prev) => {
      const next = prev.includes(req)
        ? prev.filter((r) => r !== req)
        : [...prev, req]
      return next
    })
  }, [])

  // Auto-detect all done
  const allRequirementsDone =
    completed.length === requirements.length && requirements.length > 0

  const handleReset = useCallback(() => {
    setCode(starterCode)
    setCompleted([])
    setShowSolution(false)
    setAllDone(false)
  }, [starterCode])

  return (
    <Card
      className={cn(
        "my-6",
        allRequirementsDone && "ring-1 ring-amber-500/50",
        className,
      )}
    >
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-rose-500" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={cn("text-xs font-medium", difficultyColors[difficulty])}
            >
              {difficultyEmoji[difficulty]} {difficulty}
            </Badge>
            {allRequirementsDone && (
              <Badge
                variant="outline"
                className="gap-1 border-green-500/30 text-green-600"
              >
                <Sparkles className="h-3 w-3" />
                Complete!
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Requirements checklist */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Requirements:</h4>
          <ul className="space-y-1.5">
            {requirements.map((req, i) => {
              const done = completed.includes(req)
              return (
                <li key={i}>
                  <button
                    onClick={() => toggleRequirement(req)}
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
                    {req}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Live editor */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Your Code:</h4>
          <LiveEditor
            code={code}
            onChange={setCode}
            language={language}
            height={200}
          />
        </div>

        {/* Live preview */}
        <SandboxPreview
          html={previewHtml || code}
          css={previewCss}
          js={previewType === "javascript" ? code : ""}
          type={previewType}
          title="Preview"
          height={220}
        />
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1"
        >
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
            <span className="text-sm font-medium">Reference Solution</span>
          </div>
          <LiveEditor
            code={solutionCode}
            language={language}
            height={180}
            readOnly
          />
        </CardContent>
      )}
    </Card>
  )
}
