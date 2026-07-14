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

  const showNav = prev || next

  return (
    <div className="space-y-3 sm:space-y-4">
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
      {showNav && (
        <nav
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
          aria-label="Lesson navigation"
        >
          {prev && (
            <Button variant="ghost" asChild className="h-auto py-2.5">
              <Link href={prev.href} className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                  <span className="text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                    Previous
                  </span>
                  <span className="w-full truncate text-sm leading-tight">
                    {prev.title}
                  </span>
                </div>
              </Link>
            </Button>
          )}

          {/* Spacer when only prev exists */}
          {prev && !next && <div />}

          {next && (
            <Button variant="ghost" asChild className="h-auto py-2.5">
              <Link href={next.href} className="flex items-center gap-2">
                <div className="flex min-w-0 flex-1 flex-col items-start text-left sm:items-end sm:text-right">
                  <span className="text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                    Next
                  </span>
                  <span className="w-full truncate text-sm leading-tight">
                    {next.title}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </Button>
          )}
        </nav>
      )}
    </div>
  )
}
