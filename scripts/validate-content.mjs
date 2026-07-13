#!/usr/bin/env node
/**
 * Content validator for the MDX docs platform.
 *
 * Scans `content/` and checks:
 *   1. Frontmatter — required fields + field types/enums (shared schema).
 *   2. Internal links — every `[text](/path)` resolves to a real `.mdx` file
 *      or a category directory.
 *   3. Orphans — no `.mdx` lives under a top-level dir the nav pipeline can't
 *      map to a sidebar section.
 *   4. Heading hierarchy — no skipped levels (e.g. h2 → h4).
 *   5. Code fences — every ``` block declares a language (so highlight.js works).
 *   6. Prerequisites — every `prerequisites` entry resolves to a real lesson.
 *   7. Ordering — no duplicate `order` values within a directory.
 *
 * Exits non-zero (and prints a summary) if any check fails.
 * Run with: `pnpm validate:content`
 */
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { validateFrontmatter } from "../lib/content/frontmatter-schema.mjs"
import {
  CATEGORY_SLUGS,
  ROOT_CONTENT_FILES,
} from "../constants/categories/registry.mjs"

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..")
const CONTENT_DIR = path.join(ROOT, "content")

/** Top-level content directories the sidebar pipeline knows how to place. */
const KNOWN_CATEGORIES = new Set(CATEGORY_SLUGS)

/** Root-level files that legitimately sit outside a category dir. */
const ROOT_FILES = new Set(ROOT_CONTENT_FILES)

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

/**
 * Split a raw MDX body into lines flagged for whether they sit inside a fenced
 * code block, so heading/link checks can skip fenced content.
 */
function annotateFences(raw) {
  const lines = raw.split("\n")
  let inFence = false
  return lines.map((line) => {
    const fence = /^\s*```/.test(line)
    if (fence) {
      const wasIn = inFence
      inFence = !inFence
      // The opening/closing fence line itself is "structural", not body text.
      return { line, inFence: true, isFenceMarker: true, opensFence: !wasIn }
    }
    return { line, inFence, isFenceMarker: false, opensFence: false }
  })
}

async function main() {
  const files = await collectMdx(CONTENT_DIR)

  // Build the set of valid link targets: every content path + every directory.
  const validPaths = new Set()
  const dirPaths = new Set()
  for (const file of files) {
    const cp = toContentPath(file)
    validPaths.add(cp)
    const parts = cp.split("/")
    for (let i = 1; i < parts.length; i++) {
      dirPaths.add(parts.slice(0, i).join("/"))
    }
  }

  const errors = []
  const linkRegex = /\]\((\/[^)\s#]+)(?:#[^)\s]*)?\)/g
  // order-tracking: dir -> Map<order, contentPath[]>
  const ordersByDir = new Map()

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

    // 1. Frontmatter (required fields + types/enums) via shared schema.
    const { ok, errors: fmErrors } = validateFrontmatter(data)
    if (!ok) {
      for (const e of fmErrors) errors.push(`${rel}: ${e}`)
    }

    // 3. Orphan check
    const topSegment = cp.split("/")[0]
    const isRootFile = ROOT_FILES.has(cp)
    if (!isRootFile && !KNOWN_CATEGORIES.has(topSegment)) {
      errors.push(
        `${rel}: orphaned — top-level dir "${topSegment}" is not a known category (won't appear in any sidebar section)`,
      )
    }

    // 6. Prerequisites resolve to a real lesson.
    if (Array.isArray(data.prerequisites)) {
      for (const pre of data.prerequisites) {
        if (typeof pre === "string" && !validPaths.has(pre.replace(/^\//, ""))) {
          errors.push(`${rel}: prerequisite "${pre}" does not resolve to a lesson`)
        }
      }
    }

    // 7. Track order per directory for duplicate detection.
    if (typeof data.order === "number" && !isRootFile) {
      const dir = path.dirname(cp)
      if (!ordersByDir.has(dir)) ordersByDir.set(dir, new Map())
      const m = ordersByDir.get(dir)
      if (!m.has(data.order)) m.set(data.order, [])
      m.get(data.order).push(cp)
    }

    // Line-level checks: skip fenced code for links/headings.
    const annotated = annotateFences(raw)
    let prevHeadingLevel = 0
    for (const { line, inFence, isFenceMarker, opensFence } of annotated) {
      // 5. Code fences must declare a language on the opening marker.
      if (isFenceMarker && opensFence) {
        const lang = line.replace(/^\s*```/, "").trim()
        if (lang === "") {
          errors.push(
            `${rel}: fenced code block without a language (highlight.js needs one)`,
          )
        }
        continue
      }
      if (inFence) continue

      // 4. Heading hierarchy — no skipped levels.
      const h = /^(#{1,6})\s+/.exec(line)
      if (h) {
        const level = h[1].length
        if (prevHeadingLevel > 0 && level > prevHeadingLevel + 1) {
          errors.push(
            `${rel}: heading level jumps from h${prevHeadingLevel} to h${level} ("${line.trim().slice(0, 48)}")`,
          )
        }
        prevHeadingLevel = level
      }
    }

    // 2. Internal links (whole-file scan; fenced examples rarely use /links)
    let match
    while ((match = linkRegex.exec(raw)) !== null) {
      const target = match[1].replace(/^\//, "")
      if (validPaths.has(target) || dirPaths.has(target)) continue
      errors.push(`${rel}: broken internal link "/${target}"`)
    }
  }

  // 7. Report duplicate order values within a directory.
  for (const [dir, m] of ordersByDir) {
    for (const [order, paths] of m) {
      if (paths.length > 1) {
        errors.push(
          `${dir}: duplicate order ${order} shared by ${paths.length} lessons (${paths.join(", ")})`,
        )
      }
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
