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
import { CodeBlock } from "../shared/CodeBlock"
import { Lightbulb, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StaticExerciseProps {
  title: string
  description: string
  starterCode: string
  solution?: string
  hints?: string[]
  className?: string
}

export function StaticExercise({
  title,
  description,
  starterCode,
  solution,
  hints,
  className,
}: StaticExerciseProps) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)

  const nextHint = () => {
    if (hints && hintIndex < hints.length - 1) {
      setHintIndex((i) => i + 1)
    }
  }

  return (
    <Card className={cn("my-6", className)}>
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge variant="secondary">Exercise</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <CodeBlock code={starterCode} language="tsx" title="Starter code" />

        {hints && hints.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowHint(!showHint)
                setHintIndex(0)
              }}
            >
              {showHint ? "Hide hints" : "Need a hint?"}
            </Button>
            {showHint && (
              <div className="mt-2 rounded-lg border bg-muted/30 p-3">
                <p className="text-sm text-muted-foreground">
                  {hints[hintIndex]}
                </p>
                {hintIndex < hints.length - 1 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1 h-auto p-0"
                    onClick={nextHint}
                  >
                    Another hint
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4">
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
            {showSolution ? "Hide solution" : "Show solution"}
          </Button>
        )}
      </CardFooter>

      {showSolution && solution && (
        <CardContent className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Solution</span>
          </div>
          <CodeBlock code={solution} language="tsx" />
        </CardContent>
      )}
    </Card>
  )
}
