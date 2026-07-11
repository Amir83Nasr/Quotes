/** Content frontmatter metadata */
export interface ContentMeta {
  title: string
  description: string
  order?: number
  section?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  published?: boolean
}

/** A content file node in the hierarchy */
export interface ContentNode {
  /** URL-safe slug (file name without .mdx) */
  slug: string
  /** Display title from frontmatter */
  title: string
  /** Description from frontmatter */
  description: string
  /** Absolute path on disk */
  filePath: string
  /** Relative content path: "react/hooks/use-state" */
  contentPath: string
  /** Nesting depth (0 = root category, 1 = subcategory, 2 = lesson) */
  depth: number
  /** Child nodes */
  children: ContentNode[]
  /** Category or lesson */
  type: "category" | "lesson"
  /** Optional ordering weight */
  order?: number
  /** Frontmatter difficulty */
  difficulty?: "beginner" | "intermediate" | "advanced"
}

/** Category definition from constants */
export interface Category {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href: string
  topics: { name: string; href: string }[]
}

/** All content frontmatter fields */
export interface Frontmatter {
  title: string
  description: string
  order?: number
  section?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  published?: boolean
}
