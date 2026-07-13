import { contentPathToUrl } from "@/constants/categories"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ContentNode } from "@/types/content"

interface CategoryIndexProps {
  node: ContentNode
}

/**
 * Renders an index page for a category — lists child lessons and subcategories.
 * Used when visiting a category root URL (e.g., /react, /frontend).
 */
export function CategoryIndex({ node }: CategoryIndexProps) {
  const lessons = node.children.filter((c) => c.type === "lesson")
  const subcategories = node.children.filter((c) => c.type === "category")

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{node.title}</h1>
        {node.description && (
          <p className="text-lg text-muted-foreground">{node.description}</p>
        )}
      </header>

      {/* Direct lessons */}
      {lessons.length > 0 && (
        <section className="mb-8">
          <div className="grid gap-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.contentPath}
                href={contentPathToUrl(lesson.contentPath)}
                className="group block"
              >
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      {lesson.description && (
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.difficulty && (
                        <Badge
                          variant={
                            lesson.difficulty === "beginner"
                              ? "secondary"
                              : lesson.difficulty === "intermediate"
                                ? "default"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {lesson.difficulty}
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Sections
          </h2>
          <div className="grid gap-6">
            {subcategories.map((sub) => {
              const subLessons = sub.children.filter((c) => c.type === "lesson")
              return (
                <Card key={sub.contentPath}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{sub.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {subLessons.map((lesson) => (
                        <Link
                          key={lesson.contentPath}
                          href={contentPathToUrl(lesson.contentPath)}
                        >
                          <Badge
                            variant="outline"
                            className="cursor-pointer transition-colors hover:bg-accent"
                          >
                            {lesson.title}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
