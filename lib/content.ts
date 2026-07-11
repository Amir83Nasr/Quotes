import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import type { ContentNode, Frontmatter } from "@/types/content"
import type { BreadcrumbItem, LessonNavigation, TocHeading } from "@/types/navigation"
import { CATEGORY_ORDER, contentPathToUrl } from "@/constants/categories"
import { cache } from "react"

const CONTENT_DIR = path.join(process.cwd(), "content")

/** Read frontmatter from a single MDX file */
async function readFrontmatter(filePath: string): Promise<Frontmatter | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const { data } = matter(raw)
    return data as Frontmatter
  } catch {
    return null
  }
}

/**
 * Recursively scan content directory and build the content tree.
 * Cached so multiple calls in one render reuse the result.
 */
export const getContentTree = cache(async (): Promise<ContentNode[]> => {
  const root = await buildTree(CONTENT_DIR, 0)
  return root.children ?? []
})

async function buildTree(
  dirPath: string,
  depth: number,
): Promise<ContentNode> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const mdxFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .sort()

  const subdirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .sort((a, b) => a.name.localeCompare(b.name))

  // Current directory as a node (for category nodes)
  const dirName = path.basename(dirPath)
  const relativePath = path.relative(CONTENT_DIR, dirPath)

  const children: ContentNode[] = []

  // Process subdirectories first
  for (const subdir of subdirs) {
    const child = await buildTree(
      path.join(dirPath, subdir.name),
      depth + 1,
    )
    children.push(child)
  }

  // Process MDX files
  for (const file of mdxFiles) {
    const filePath = path.join(dirPath, file.name)
    const meta = await readFrontmatter(filePath)
    const slug = file.name.replace(/\.mdx$/, "")

    // Build content path relative to content dir
    const parentRelative = path.relative(CONTENT_DIR, dirPath)
    const contentPath = parentRelative ? `${parentRelative}/${slug}` : slug

    // Category pages (index.mdx in a subdirectory)
    if (slug === "index") {
      // This is the category page itself — we'll handle it elsewhere
      continue
    }

    children.push({
      slug,
      title: meta?.title ?? slug,
      description: meta?.description ?? "",
      filePath,
      contentPath,
      depth: depth + 1,
      children: [],
      type: "lesson",
      order: meta?.order,
      difficulty: meta?.difficulty,
    })
  }

  // Sort children by order then name
  children.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.title.localeCompare(b.title)
  })

  return {
    slug: dirName,
    title: dirName.charAt(0).toUpperCase() + dirName.slice(1),
    description: "",
    filePath: dirPath,
    contentPath: relativePath || dirName,
    depth,
    children,
    type: "category",
    // Pedagogical order for top-level categories; deeper nodes unaffected
    ...(CATEGORY_ORDER[dirName] !== undefined && { order: CATEGORY_ORDER[dirName] }),
  }
}

/** Get a flat list of all lessons */
export const getAllLessons = cache(async (): Promise<ContentNode[]> => {
  const tree = await getContentTree()
  const lessons: ContentNode[] = []
  function walk(nodes: ContentNode[]) {
    for (const node of nodes) {
      if (node.type === "lesson") {
        lessons.push(node)
      }
      if (node.children.length > 0) {
        walk(node.children)
      }
    }
  }
  walk(tree)
  return lessons
})

/** Get a specific content node by its contentPath */
export const getContentNode = cache(
  async (contentPath: string): Promise<ContentNode | null> => {
    const tree = await getContentTree()
    function find(nodes: ContentNode[]): ContentNode | null {
      for (const node of nodes) {
        if (node.contentPath === contentPath) return node
        if (node.children.length > 0) {
          const found = find(node.children)
          if (found) return found
        }
      }
      return null
    }
    return find(tree)
  },
)

/** Read raw MDX content for a content path */
export const getMdxSource = cache(
  async (contentPath: string): Promise<string | null> => {
    const filePath = path.join(CONTENT_DIR, ...contentPath.split("/")) + ".mdx"
    try {
      return await fs.readFile(filePath, "utf-8")
    } catch {
      return null
    }
  },
)

/** Extract TOC headings from MDX source (quick regex, no full parse) */
export function extractToc(source: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: TocHeading[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length
    const text = match[2].replaceAll(/[`*_]/g, "").trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w一-鿿\s-]/g, "")
      .replace(/\s+/g, "-")
    toc.push({ id, text, level })
  }

  return toc
}

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
