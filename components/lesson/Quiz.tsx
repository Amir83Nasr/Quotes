"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizProps {
  title?: string
  questions: QuizQuestion[]
  className?: string
}

export function Quiz({ title = "Quick Quiz", questions = [], className }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const selectAnswer = useCallback((qIdx: number, optIdx: number) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
  }, [submitted])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    setShowResults(true)
  }, [])

  const handleReset = useCallback(() => {
    setAnswers({})
    setSubmitted(false)
    setShowResults(false)
  }, [])

  const answeredCount = Object.keys(answers).length
  const correctCount = questions.filter(
    (q, i) => answers[i] === q.correctIndex,
  ).length
  const allAnswered = answeredCount === questions.length

  return (
    <Card className={cn("my-6", className)}>
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription>
          Test your understanding of this lesson
          {!submitted && (
            <span className="ml-1 text-muted-foreground">
              ({answeredCount}/{questions.length} answered)
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {questions.map((q, qIdx) => {
          const selected = answers[qIdx]
          const isCorrect = selected === q.correctIndex
          const showAnswer = submitted

          return (
            <div key={qIdx} className="space-y-2">
              <p className="text-sm font-medium">
                {qIdx + 1}. {q.question}
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selected === oIdx
                  const isRightAnswer = showAnswer && oIdx === q.correctIndex
                  const isWrongSelected =
                    showAnswer && isSelected && !isCorrect

                  return (
                    <button
                      key={oIdx}
                      onClick={() => selectAnswer(qIdx, oIdx)}
                      disabled={submitted}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        !submitted &&
                          "hover:border-primary/50 hover:bg-accent/50",
                        isSelected &&
                          !submitted &&
                          "border-primary bg-primary/5",
                        isRightAnswer &&
                          "border-green-500/50 bg-green-50 dark:bg-green-950",
                        isWrongSelected &&
                          "border-red-500/50 bg-red-50 dark:bg-red-950",
                        submitted && "cursor-default",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                          showAnswer && oIdx === q.correctIndex &&
                            "border-green-500 bg-green-500 text-white",
                          showAnswer && isWrongSelected &&
                            "border-red-500 bg-red-500 text-white",
                          !showAnswer && isSelected &&
                            "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isRightAnswer && (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      )}
                      {isWrongSelected && (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      )}
                    </button>
                  )
                })}
              </div>
              {showAnswer && (
                <p
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm",
                    isCorrect
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-muted/50 text-muted-foreground",
                  )}
                >
                  {q.explanation}
                </p>
              )}
            </div>
          )
        })}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {submitted ? (
            <span
              className={cn(
                "font-medium",
                correctCount === questions.length
                  ? "text-green-600"
                  : "text-amber-600",
              )}
            >
              {correctCount}/{questions.length} correct
            </span>
          ) : (
            <span>
              {allAnswered
                ? "Ready to check your answers?"
                : "Answer all questions to check"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {submitted && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Retry
            </Button>
          )}
          {!submitted && (
            <Button size="sm" onClick={handleSubmit} disabled={!allAnswered}>
              Check answers
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
