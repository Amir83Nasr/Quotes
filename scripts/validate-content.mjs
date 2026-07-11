#!/usr/bin/env node
/**
 * Content validator for the MDX docs platform.
 *
 * Scans `content/` and checks:
 *   1. Required frontmatter — every `.mdx` has non-empty `title` + `description`.
 *   2. Internal links — every `[text](/path)` resolves to a real `.mdx` file
 *      or a category directory.
 *   3. Orphans — no `.mdx` lives under a top-level dir the nav pipeline can't
 *      map to a sidebar section.
 *
 * Exits non-zero (and prints a summary) if any check fails.
 * Run with: `pnpm validate:content`
 */
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..")
const CONTENT_DIR = path.join(ROOT, "content")

/**
 * Top-level content directories the sidebar pipeline knows how to place.
 * Keep in sync with CATEGORY_ROUTES in constants/categories/index.ts.
 */
const KNOWN_CATEGORIES = new Set([
  "react",
  "nextjs",
  "tailwind",
  "shadcn",
  "advanced",
  "fullstack",
  "practice",
  "gallery",
  "frontend",
])

/** Root-level files that legitimately sit outside a category dir. */
const ROOT_FILES = new Set(["index", "categories"])

const REQUIRED_FRONTMATTER = ["title", "description"]

/** Recursively collect every `.mdx` file path under `dir`. */
async function collectMdx(dir) {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await collectMdx(full)))
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      out.push(full)
    }
  }
  return out
}

/** content-relative path without extension, e.g. "frontend/javascript/intro". */
function toContentPath(absFile) {
  return path
    .relative(CONTENT_DIR, absFile)
    .replace(/\.mdx$/, "")
    .split(path.sep)
    .join("/")
}

async function main() {
  const files = await collectMdx(CONTENT_DIR)

  // Build the set of valid link targets: every content path + every directory.
  const validPaths = new Set()
  const dirPaths = new Set()
  for (const file of files) {
    const cp = toContentPath(file)
    validPaths.add(cp)
    // Register each ancestor directory as a valid category-index target.
    const parts = cp.split("/")
    for (let i = 1; i < parts.length; i++) {
      dirPaths.add(parts.slice(0, i).join("/"))
    }
  }

  const errors = []
  const linkRegex = /\]\((\/[^)\s#]+)(?:#[^)\s]*)?\)/g

  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const cp = toContentPath(file)
    const raw = await readFile(file, "utf-8")

    let data
    try {
      ;({ data } = matter(raw))
    } catch (err) {
      errors.push(`${rel}: failed to parse frontmatter (${err.message})`)
      continue
    }

    // 1. Required frontmatter
    for (const key of REQUIRED_FRONTMATTER) {
      const value = data[key]
      if (typeof value !== "string" || value.trim() === "") {
        errors.push(`${rel}: missing or empty frontmatter field "${key}"`)
      }
    }

    // 3. Orphan check
    const topSegment = cp.split("/")[0]
    const isRootFile = ROOT_FILES.has(cp)
    if (!isRootFile && !KNOWN_CATEGORIES.has(topSegment)) {
      errors.push(
        `${rel}: orphaned — top-level dir "${topSegment}" is not a known category (won't appear in any sidebar section)`,
      )
    }

    // 2. Internal links
    let match
    while ((match = linkRegex.exec(raw)) !== null) {
      const target = match[1].replace(/^\//, "") // strip leading slash
      if (validPaths.has(target) || dirPaths.has(target)) continue
      errors.push(`${rel}: broken internal link "/${target}"`)
    }
  }

  if (errors.length > 0) {
    console.error(`\n✖ Content validation failed — ${errors.length} issue(s):\n`)
    for (const e of errors) console.error(`  • ${e}`)
    console.error("")
    process.exit(1)
  }

  console.log(`✓ Content valid — ${files.length} MDX files checked, no issues.`)
}

main().catch((err) => {
  console.error("Validator crashed:", err)
  process.exit(1)
})
