/**
 * Zero-dependency frontmatter validator.
 *
 * Shared by the runtime content reader (`lib/content/source.ts`, via allowJs)
 * and the build-time validator script (`scripts/validate-content.mjs`). Keeping
 * the rules in one place means a lesson that passes `pnpm validate:content`
 * renders with exactly the fields the app expects — no drift between CI and
 * runtime.
 *
 * Deliberately hand-rolled rather than pulling in a schema library, matching
 * this repo's zero-runtime-dependency convention (see the hand-written
 * remark/rehype plugins in `lib/mdx.ts`).
 */

/** @typedef {"beginner" | "intermediate" | "advanced"} Difficulty */

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim() !== ""
}

function isStringArray(v) {
  return Array.isArray(v) && v.every((x) => typeof x === "string")
}

/**
 * Validate a parsed frontmatter object.
 *
 * @param {Record<string, unknown>} data - object from gray-matter `data`
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateFrontmatter(data) {
  const errors = []
  const d = data ?? {}

  // Required
  if (!isNonEmptyString(d.title)) {
    errors.push('missing or empty frontmatter field "title"')
  }
  if (!isNonEmptyString(d.description)) {
    errors.push('missing or empty frontmatter field "description"')
  }

  // Optional — validated only when present
  if (d.order !== undefined && typeof d.order !== "number") {
    errors.push('"order" must be a number')
  }
  if (d.published !== undefined && typeof d.published !== "boolean") {
    errors.push('"published" must be a boolean')
  }
  if (d.section !== undefined && !isNonEmptyString(d.section)) {
    errors.push('"section" must be a non-empty string')
  }
  if (d.difficulty !== undefined && !DIFFICULTIES.includes(d.difficulty)) {
    errors.push(
      `"difficulty" must be one of ${DIFFICULTIES.join(", ")} (got "${d.difficulty}")`,
    )
  }
  if (d.tags !== undefined && !isStringArray(d.tags)) {
    errors.push('"tags" must be an array of strings')
  }
  if (
    d.estimatedMinutes !== undefined &&
    (typeof d.estimatedMinutes !== "number" || d.estimatedMinutes <= 0)
  ) {
    errors.push('"estimatedMinutes" must be a positive number')
  }
  if (d.prerequisites !== undefined && !isStringArray(d.prerequisites)) {
    errors.push('"prerequisites" must be an array of content paths')
  }
  if (
    d.updated !== undefined &&
    !(typeof d.updated === "string" && ISO_DATE.test(d.updated))
  ) {
    // YAML auto-parses unquoted `2026-07-11` into a Date; require an explicit
    // quoted string so the value matches the `Frontmatter.updated: string` type.
    const hint =
      d.updated instanceof Date
        ? " (quote it: updated: \"YYYY-MM-DD\")"
        : ""
    errors.push(`"updated" must be an ISO date string (YYYY-MM-DD)${hint}`)
  }

  return { ok: errors.length === 0, errors }
}
