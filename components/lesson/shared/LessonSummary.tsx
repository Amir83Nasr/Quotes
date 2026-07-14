import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface LessonSummaryProps {
  points: string[]
  className?: string
}

/**
 * Key takeaways at the end of a lesson.
 * RSC-compatible.
 */
export function LessonSummary({ points = [], className }: LessonSummaryProps) {
  return (
    <div className={cn("my-6 rounded-lg border bg-muted/30 p-4", className)}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        Key Takeaways
      </div>
      <div className="space-y-3">
        {points.map((point, i) => (
          <div
            key={i}
            className="text-sm leading-relaxed text-muted-foreground"
          >
            {point}
          </div>
        ))}
      </div>
    </div>
  )
}
