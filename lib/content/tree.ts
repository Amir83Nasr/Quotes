import fs from "node:fs/promises"
import path from "node:path"
import type { ContentNode } from "@/types/content"
import { CATEGORY_ORDER } from "@/constants/categories"
import { cache } from "react"
import { CONTENT_DIR, readFrontmatter } from "./source"

/**
 * Recursively scan content directory and build the content tree.
 * Cached so multiple calls in one render reuse the result.
 */
export const getContentTree = cache(async (): Promise<ContentNode[]> => {
  const root = await buildTree(CONTENT_DIR, 0)
  return root.children ?? []
})

async function buildTree(dirPath: string, depth: number): Promise<ContentNode> {
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
    const child = await buildTree(path.join(dirPath, subdir.name), depth + 1)
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
    ...(CATEGORY_ORDER[dirName] !== undefined && {
      order: CATEGORY_ORDER[dirName],
    }),
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
  }
)
