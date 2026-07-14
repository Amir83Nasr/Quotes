#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.resolve(__dirname, "../content")
let count = 0

function processDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name)
    if (
      entry.isDirectory() &&
      !entry.name.startsWith("_") &&
      !entry.name.startsWith(".")
    )
      processDir(fp)
    else if (entry.isFile() && entry.name.endsWith(".mdx")) processFile(fp)
  }
}

function processFile(fp) {
  const orig = fs.readFileSync(fp, "utf-8")
  if (!orig.includes("<InteractiveExercise")) return
  let s = orig
  // Replace opening tag with mode="challenge"
  s = s.replace(
    /<InteractiveExercise\s+/g,
    '<LessonCodeExample\n  mode="challenge"\n  '
  )
  s = s.replace(/<\/InteractiveExercise>/g, "</LessonCodeExample>")
  // Rename props
  s = s.replace(/starterCode=/g, "code=")
  s = s.replace(/solutionCode=/g, "solution=")
  if (s !== orig) {
    fs.writeFileSync(fp, s, "utf-8")
    console.log(`  ${path.relative(CONTENT_DIR, fp)}`)
    count++
  }
}

console.log(
  'Converting <InteractiveExercise> → <LessonCodeExample mode="challenge">...'
)
processDir(CONTENT_DIR)
console.log(`Done. ${count} files modified.`)
