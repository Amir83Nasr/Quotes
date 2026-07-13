#!/usr/bin/env node
/**
 * Lesson scaffolding CLI.
 *
 *   pnpm new:lesson <category/slug>
 *   pnpm new:lesson react/hooks/use-transition
 *   pnpm new:lesson git/intro --difficulty beginner --minutes 8
 *
 * Generates a correctly-structured `.mdx` skeleton under `content/`, wired with
 * the frontmatter fields the platform validates (`pnpm validate:content`) and
 * the lesson widgets registered in `components/lesson/mdx-registry.tsx`. Picks
 * the next free `order` in the target directory and never overwrites a file.
 */
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { CATEGORY_SLUGS } from "../constants/categories/registry.mjs"
import { DIFFICULTIES } from "../lib/content/frontmatter-schema.mjs"

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..")
const CONTENT_DIR = path.join(ROOT, "content")

function parseArgs(argv) {
  const positional = []
  const flags = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--")) {
      flags[a.slice(2)] = argv[++i]
    } else {
      positional.push(a)
    }
  }
  return { positional, flags }
}

/** "use-transition" → "Use Transition" (a sensible default title). */
function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

/** Next free `order` in a directory: max existing order + 1 (or 1 if empty). */
async function nextOrder(dirAbs) {
  let max = 0
  try {
    const entries = await readdir(dirAbs, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isFile() || !e.name.endsWith(".mdx")) continue
      const raw = await readFile(path.join(dirAbs, e.name), "utf-8")
      const { data } = matter(raw)
      if (typeof data.order === "number" && data.order > max) max = data.order
    }
  } catch {
    // dir doesn't exist yet
  }
  return max + 1
}

function skeleton({ title, description, order, difficulty, minutes, updated }) {
  return `---
title: ${title}
description: ${description}
order: ${order}
difficulty: ${difficulty}
estimatedMinutes: ${minutes}
tags: []
updated: "${updated}"
---

# ${title}

One or two sentences framing why this matters and what the reader will be able
to do by the end.

<LearningObjectives objectives={[
  "First thing the reader will be able to do",
  "Second concrete, testable skill",
  "Third skill or concept",
]} />

## Core Concept

Explain the main idea. Show it with a focused example:

\`\`\`tsx
// Replace with a minimal, runnable example
export function Example() {
  return <div>Hello</div>
}
\`\`\`

## Going Deeper

Build on the concept. Use an <Alert> for a key insight when it helps:

<Alert>
<AlertTitle>Key Insight</AlertTitle>
<AlertDescription>The one thing readers most often get wrong.</AlertDescription>
</Alert>

## Check Your Understanding

<LessonCodeExample
  code={`// Replace with a runnable example
console.log("Test your understanding")`}
  language="javascript"
  title="Try it yourself"
  executable
  showLineNumbers
  explanation="Describe what this code does and why it matters."
/>

<LessonSummary points={[
  "Key takeaway one",
  "Key takeaway two",
  "Key takeaway three",
]} />
`
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2))
  const target = positional[0]

  if (!target || !target.includes("/")) {
    console.error("Usage: pnpm new:lesson <category/slug> [--difficulty <d>] [--minutes <n>] [--title \"...\"] [--desc \"...\"]")
    console.error(`  difficulty: ${DIFFICULTIES.join(" | ")}`)
    process.exit(1)
  }

  const parts = target.replace(/\.mdx$/, "").split("/")
  const topCategory = parts[0]
  const slug = parts[parts.length - 1]
  const relPath = parts.join(path.sep) + ".mdx"
  const fileAbs = path.join(CONTENT_DIR, relPath)
  const dirAbs = path.dirname(fileAbs)

  // Refuse to overwrite.
  try {
    await readFile(fileAbs, "utf-8")
    console.error(`✖ Refusing to overwrite existing lesson: content/${parts.join("/")}.mdx`)
    process.exit(1)
  } catch {
    // good — file doesn't exist
  }

  const difficulty = flags.difficulty ?? "beginner"
  if (!DIFFICULTIES.includes(difficulty)) {
    console.error(`✖ Invalid --difficulty "${difficulty}". Use one of: ${DIFFICULTIES.join(", ")}`)
    process.exit(1)
  }

  const order = await nextOrder(dirAbs)
  const title = flags.title ?? titleFromSlug(slug)
  const description = flags.desc ?? `TODO: one-line description of ${title}`
  const minutes = Number(flags.minutes ?? 10)
  // Timestamp passed via flag or left as a TODO — avoids embedding a build clock.
  const updated = flags.updated ?? new Date().toISOString().slice(0, 10)

  await mkdir(dirAbs, { recursive: true })
  await writeFile(fileAbs, skeleton({ title, description, order, difficulty, minutes, updated }))

  console.log(`✓ Created content/${parts.join("/")}.mdx (order ${order}, ${difficulty})`)

  if (!CATEGORY_SLUGS.includes(topCategory)) {
    console.log("")
    console.log(`⚠ "${topCategory}" is a new top-level category. To make it appear in the`)
    console.log("  sidebar and pass validation, register it in:")
    console.log("    • constants/categories/registry.mjs  → add to CATEGORY_SLUGS")
    console.log("    • constants/categories/index.ts       → add to CATEGORIES")
    console.log("    • constants/categories/sidebar.ts     → add to SIDEBAR_LABELS + SIDEBAR_SECTIONS")
    console.log("    • constants/categories/icons.ts       → add CATEGORY_ICONS + CATEGORY_COLORS")
  }
}

main().catch((err) => {
  console.error("Scaffolder crashed:", err)
  process.exit(1)
})
