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
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
        <Target className="h-4 w-4" />
        What you&apos;ll learn
      </div>
      <div className="space-y-3">
        {objectives.map((obj, i) => (
          <div key={i} className="text-sm leading-relaxed">
            {obj}
          </div>
        ))}
      </div>
    </div>
  )
}
