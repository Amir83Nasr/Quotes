import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import type { Frontmatter } from "@/types/content"
import { cache } from "react"
import { validateFrontmatter } from "./frontmatter-schema.mjs"

/** Absolute path to the on-disk content root. */
export const CONTENT_DIR = path.join(process.cwd(), "content")

/** Read frontmatter from a single MDX file */
export async function readFrontmatter(
  filePath: string
): Promise<Frontmatter | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const { data } = matter(raw)
    // Warn (dev) on malformed frontmatter so authoring mistakes surface early
    // instead of rendering as an `undefined` title. `pnpm validate:content`
    // turns these same checks into hard CI failures.
    if (process.env.NODE_ENV !== "production") {
      const { ok, errors } = validateFrontmatter(data)
      if (!ok) {
        console.warn(
          `[content] frontmatter issues in ${filePath}:\n  - ${errors.join("\n  - ")}`
        )
      }
    }
    return data as Frontmatter
  } catch {
    return null
  }
}

/** Read raw MDX content for a content path */
export const getMdxSource = cache(
  async (contentPath: string): Promise<string | null> => {
    const filePath = path.join(CONTENT_DIR, ...contentPath.split("/")) + ".mdx"
    try {
      return await fs.readFile(filePath, "utf-8")
    } catch {
      return null
    }
  }
)
