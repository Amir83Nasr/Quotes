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
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        Key Takeaways
      </div>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
