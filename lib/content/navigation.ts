import type { BreadcrumbItem, LessonNavigation } from "@/types/navigation"
import { contentPathToUrl } from "@/constants/categories"
import { cache } from "react"
import { getAllLessons, getContentNode } from "./tree"

/** Build breadcrumbs from a content path */
export async function buildBreadcrumbs(
  contentPath: string,
): Promise<BreadcrumbItem[]> {
  const parts = contentPath.split("/")
  const crumbs: BreadcrumbItem[] = []

  // Root breadcrumb
  crumbs.push({
    label: "Home",
    href: "/",
    isCurrent: false,
  })

  // Accumulate path segments
  let accumulated = ""
  for (let i = 0; i < parts.length; i++) {
    const segment = parts[i]
    accumulated = accumulated ? `${accumulated}/${segment}` : segment

    const url = contentPathToUrl(accumulated)
    const node = await getContentNode(accumulated)

    crumbs.push({
      label: node?.title ?? segment,
      href: url,
      isCurrent: i === parts.length - 1,
    })
  }

  return crumbs
}

/** Build previous/next navigation from content tree */
export const buildLessonNavigation = cache(
  async (contentPath: string): Promise<LessonNavigation> => {
    const lessons = await getAllLessons()
    const currentIndex = lessons.findIndex((l) => l.contentPath === contentPath)

    if (currentIndex === -1) {
      return { prev: null, next: null }
    }

    const prev =
      currentIndex > 0
        ? {
            title: lessons[currentIndex - 1].title,
            href: contentPathToUrl(lessons[currentIndex - 1].contentPath),
          }
        : null

    const next =
      currentIndex < lessons.length - 1
        ? {
            title: lessons[currentIndex + 1].title,
            href: contentPathToUrl(lessons[currentIndex + 1].contentPath),
          }
        : null

    return { prev, next }
  },
)
