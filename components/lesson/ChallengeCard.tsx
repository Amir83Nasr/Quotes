"use client"

import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { CodeBlock } from "./CodeBlock"
import { Target, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChallengeCardProps {
  title: string
  description: string
  requirements: string[]
  starterCode: string
  solution?: string
  difficulty?: "easy" | "medium" | "hard"
  className?: string
}

const difficultyColors = {
  easy: "bg-green-500/10 text-green-600 dark:text-green-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function ChallengeCard({
  title,
  description,
  requirements,
  starterCode,
  solution,
  difficulty = "medium",
  className,
}: ChallengeCardProps) {
  const [completed, setCompleted] = useState<string[]>([])
  const [showSolution, setShowSolution] = useState(false)

  const toggleRequirement = (req: string) => {
    setCompleted((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req],
    )
  }

  return (
    <Card className={cn("my-6", className)}>
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-rose-500" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge className={cn("text-xs font-medium", difficultyColors[difficulty])}>
            {difficulty}
          </Badge>
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

        <CodeBlock code={starterCode} language="tsx" title="Starter code" />
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://codesandbox.io/p/sandbox?code=${encodeURIComponent(starterCode)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Sandbox
          </a>
        </Button>

        {solution && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? "Hide solution" : "View solution"}
          </Button>
        )}
      </CardFooter>

      {showSolution && solution && (
        <CardContent className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Reference Solution</span>
          </div>
          <CodeBlock code={solution} language="tsx" />
        </CardContent>
      )}
    </Card>
  )
}
