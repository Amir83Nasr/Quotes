"use client"

import Link from "next/link"
import { CATEGORIES, SIDEBAR_SECTIONS } from "@/constants"
import { CategoryCard } from "@/components/docs/CategoryCard"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Target,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useSyncExternalStore, useCallback } from "react"
import type { Category } from "@/types/content"

/** Build a lookup of category id → category object */
const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

/** Icons per section */
const SECTION_ICONS: Record<string, React.ElementType> = {
  Foundations: BookOpen,
  "Styling & UI": Sparkles,
  "Core Framework": Target,
  Advanced: Trophy,
  Projects: Trophy,
}

/** True once client-side hydration completes — avoids hydration mismatch for theme icon */
function useMounted() {
  return useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => true,
    () => false
  )
}

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5" />
            <span>Quotes</span>
          </div>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/frontend/html/intro">
              Start Learning <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Structured learning path — from zero to production
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Master Web Development
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                A guided, example-driven curriculum. Learn HTML &rarr; CSS
                &rarr; JavaScript &rarr; TypeScript &rarr; React &rarr; Next.js.
                Build real projects at every step.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/frontend/html/intro">
                    Start the Path <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/practice/todo-app">Try a Project</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Learning Path Steps ── */}
        <section className="border-b bg-muted">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Your Learning Path
            </h2>
            <p className="mb-10 text-muted-foreground">
              A carefully sequenced curriculum — each section builds on the
              last.
            </p>

            <div className="relative">
              {/* Connecting line (desktop) */}
              <div className="absolute top-0 left-7 hidden h-full w-px bg-linear-to-b from-primary/40 via-primary/20 to-transparent md:block" />

              <div className="space-y-10">
                {SIDEBAR_SECTIONS.map((section, idx) => {
                  const cats = section.categories
                    .map((id) => categoryMap[id])
                    .filter(Boolean) as Category[]

                  if (cats.length === 0) return null

                  const Icon = SECTION_ICONS[section.label] ?? BookOpen

                  return (
                    <div key={section.label} className="relative md:pl-16">
                      {/* Step dot */}
                      <div
                        className={cn(
                          "absolute top-1 left-4.5 hidden h-5 w-5 rounded-full border-2 bg-background md:flex md:items-center md:justify-center",
                          idx === 0 && "border-primary"
                        )}
                      >
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            idx === 0 ? "bg-primary" : "bg-muted-foreground/30"
                          )}
                        />
                      </div>

                      {/* Section header */}
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg md:hidden",
                            idx === 0
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted-foreground/10 text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight">
                            {idx + 1}. {section.label}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {cats.length}{" "}
                            {cats.length === 1 ? "topic" : "topics"}
                          </p>
                        </div>
                      </div>

                      {/* Category cards */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cats.map((category) => (
                          <CategoryCard key={category.id} category={category} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Why This Path ── */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="rounded-lg border bg-card p-8 md:p-12">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">
              How This Works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  1
                </div>
                <h3 className="font-semibold">Follow the Path</h3>
                <p className="text-sm text-muted-foreground">
                  Start with Foundations and work your way up. Each lesson
                  assumes you know the previous topic.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  2
                </div>
                <h3 className="font-semibold">Learn by Doing</h3>
                <p className="text-sm text-muted-foreground">
                  Every concept comes with code examples, live previews, and
                  hands-on exercises. Write code, not just read.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  3
                </div>
                <h3 className="font-semibold">Build Projects</h3>
                <p className="text-sm text-muted-foreground">
                  After each major section, apply everything in a real project.
                  From landing pages to full-stack apps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="border-t bg-muted">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center md:px-6 md:py-16">
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Ready to start your journey?
            </h2>
            <p className="mb-6 text-muted-foreground">
              No setup, no account needed. Just open your first lesson and start
              coding.
            </p>
            <Button size="lg" asChild>
              <Link href="/frontend/html/intro">
                Begin with HTML <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
