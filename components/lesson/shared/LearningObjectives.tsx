import { cn } from "@/lib/utils"
import { Target } from "lucide-react"

interface LearningObjectivesProps {
  objectives: string[]
  className?: string
}

/**
 * Renders lesson learning objectives in a concise card.
 * RSC-compatible — no interactivity needed.
 */
export function LearningObjectives({
  objectives = [],
  className,
}: LearningObjectivesProps) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-primary/20 bg-primary/5 p-4",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
        <Target className="h-4 w-4" />
        What you&apos;ll learn
      </div>
      <ul className="space-y-1.5">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
            {obj}
          </li>
        ))}
      </ul>
    </div>
  )
}
