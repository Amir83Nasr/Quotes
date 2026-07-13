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
import { CodeBlock } from "../shared/CodeBlock"
import { Checklist, difficultyColors, type Difficulty } from "../shared/Checklist"
import { Target, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StaticChallengeProps {
  title: string
  description: string
  requirements: string[]
  starterCode: string
  solution?: string
  difficulty?: Difficulty
  className?: string
}

export function StaticChallenge({
  title,
  description,
  requirements,
  starterCode,
  solution,
  difficulty = "intermediate",
  className,
}: StaticChallengeProps) {
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
        <Checklist
          title="Requirements:"
          items={requirements}
          completed={completed}
          onToggle={toggleRequirement}
        />

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
