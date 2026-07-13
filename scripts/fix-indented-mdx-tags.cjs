#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Auto-fix indented MDX closing tags that would be misinterpreted as
 * indented code blocks by the markdown/MDX parser.
 *
 * Problem:
 *   - 4+ spaces before `</TabsContent>` → parsed as indented code block
 *   - `</TabsContent>` immediately after a list → parsed as list continuation
 *
 * Fix:
 *   - Unindent known block-level closing tags to 0 (they're block-level,
 *     indentation is meaningless to MDX compilation)
 *   - Insert blank line before tag when it follows a list item
 */

const fs = require("node:fs")
const path = require("node:path")

const CONTENT_DIR = path.join(process.cwd(), "content")

/** MDX block-level tags that must NOT be indented (markdown treats 4+ spaces as code) */
const BLOCK_CLOSE_TAGS = [
  "</TabsContent>",
  "</Tabs>",
  "</TabsList>",
  "</Alert>",
  "</AlertDescription>",
  "</AlertTitle>",
  "</Card>",
  "</CardContent>",
  "</CardHeader>",
  "</CardFooter>",
  "</CardTitle>",
  "</CardDescription>",
]

/** Check if a line looks like a markdown list item */
function isListItem(line) {
  const trimmed = line.trim()
  // Only match `- ` or `* ` at a list-indent level (0-6 spaces).
  // Exclude `+ ` which is valid markdown but rarely used, and causes
  // false-positives on inline code like `+ merge`.
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) return true
  if (/^\d+[.)]\s/.test(trimmed)) return true
  return false
}

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, "utf-8")
  const lines = original.split("\n")
  const fixed = [...lines]
  let changed = false

  for (let i = 0; i < fixed.length; i++) {
    const line = fixed[i]
    const trimmed = line.trim()

    // Check if this line is an indented block-level closing tag
    const isBlockClose = BLOCK_CLOSE_TAGS.some((tag) => trimmed === tag)
    if (!isBlockClose) continue

    const indent = line.length - line.trimStart().length

    // Fix 1: unindent 4+ spaces (indented code block risk)
    if (indent >= 4) {
      fixed[i] = line.trimStart()
      changed = true
    }

    // Fix 2: ensure blank line before tag when it follows a list item
    if (i > 0) {
      // Check lines backwards for the nearest non-blank line
      let j = i - 1
      while (j >= 0 && fixed[j].trim() === "") {
        j--
      }
      if (j >= 0 && isListItem(fixed[j])) {
        // Need blank line between list and closing tag
        // If current prev line is not blank, insert one
        if (fixed[i - 1].trim() !== "") {
          fixed.splice(i, 0, "")
          i++ // skip the blank line we just inserted
          changed = true
        }
      }
    }
  }

  if (changed) {
    const result = fixed.join("\n")
    fs.writeFileSync(filePath, result, "utf-8")
    console.log(`  Fixed: ${path.relative(process.cwd(), filePath)}`)
    return true
  }
  return false
}

function walkDir(dir) {
  let count = 0
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      count += walkDir(fullPath)
    } else if (entry.name.endsWith(".mdx")) {
      if (fixFile(fullPath)) count++
    }
  }
  return count
}

const fixed = walkDir(CONTENT_DIR)
if (fixed > 0) {
  console.log(`\n✓ Fixed ${fixed} MDX file(s). Stage them before commit.\n`)
} else {
  console.log("✓ All MDX files clean — no indented block tags found.\n")
}
