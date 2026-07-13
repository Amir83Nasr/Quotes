/**
 * Single source of truth for top-level content categories.
 *
 * Pure data, authored as `.mjs` so it can be imported by both TypeScript
 * modules (via `allowJs`) and the plain-Node validator script
 * (`scripts/validate-content.mjs`) without a build step. Adding a new track
 * means adding one slug here — routing and content validation both derive
 * from this list, so they can no longer drift apart.
 */

/** Top-level directories under `content/` that map to a sidebar section. */
export const CATEGORY_SLUGS = [
  "git",
  "web",
  "frontend",
  "react",
  "nextjs",
  "tailwind",
  "shadcn",
  "advanced",
  "fullstack",
  "security",
  "practice",
  "gallery",
]

/** Root-level `.mdx` files that legitimately sit outside a category dir. */
export const ROOT_CONTENT_FILES = ["index", "categories"]
