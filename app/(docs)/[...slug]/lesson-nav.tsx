"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/hooks/use-progress"
import { usePathname } from "next/navigation"
import type { LessonNavigation } from "@/types/navigation"

interface LessonNavProps {
  navigation: LessonNavigation
}

export function LessonNav({ navigation }: LessonNavProps) {
  const { prev, next } = navigation
  const pathname = usePathname()
  const { isCompleted, markCompleted } = useProgress()
  const completed = isCompleted(pathname)

  return (
    <div className="space-y-4">
      {/* Mark Complete button */}
      <div className="flex justify-center">
        <Button
          variant={completed ? "secondary" : "default"}
          size="sm"
          onClick={() => markCompleted(pathname)}
          className="gap-2"
        >
          {completed ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              Completed
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" />
              Mark Complete
            </>
          )}
        </Button>
      </div>

      {/* Prev / Next navigation */}
      {(prev || next) && (
        <nav
          className="flex items-center justify-between gap-4"
          aria-label="Lesson navigation"
        >
          <div>
            {prev && (
              <Button variant="ghost" asChild>
                <Link href={prev.href} className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs text-muted-foreground">
                      Previous
                    </span>
                    <span className="text-sm font-medium">{prev.title}</span>
                  </div>
                </Link>
              </Button>
            )}
          </div>

          <div>
            {next && (
              <Button variant="ghost" asChild>
                <Link href={next.href} className="flex items-center gap-1">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-xs text-muted-foreground">Next</span>
                    <span className="text-sm font-medium">{next.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
