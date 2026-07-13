# Quotes

Interactive learning platform for web dev — frontend, fullstack, git, modern frameworks.

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router), React 19.2.4
- **Language:** TypeScript 5 strict, Node ESM
- **Styling:** Tailwind CSS v4 (CSS-based, no `tailwind.config.ts`), `@tailwindcss/typography`, `tw-animate-css`, `tailwind-merge`, `class-variance-authority`
- **Content:** MDX via `next-mdx-remote` (RSC), gray-matter, rehype-highlight (highlight.js), remark-gfm
- **Interactive:** CodeMirror 6 (autocomplete, lang-css/html/javascript, one-dark), highlight.js (static syntax highlighting)
- **UI:** Radix UI + shadcn/ui (radix-vega style, lucide-react icons, 11 primitives)
- **Fonts:** Inter (sans), Geist Mono (mono) via next/font/google
- **Package:** pnpm (workspace root-only, blocked: msw, esbuild)
- **Dev port:** 4000

## Quick Start

```bash
pnpm dev              # Dev server :4000
pnpm build            # Build prod
pnpm start            # Start prod server
pnpm lint             # ESLint 9 flat config (core-web-vitals + typescript)
pnpm format           # Prettier (all .ts/.tsx)
pnpm typecheck        # tsc --noEmit
pnpm validate:content # Full MDX validation (7 checks)
pnpm new:lesson       # Scaffold: pnpm new:lesson <category/slug> [--difficulty] [--minutes]
make check            # lint + typecheck (quality gate)
make clean            # rm -rf .next out build coverage
make doctor           # System check (node, pnpm, docker, port 4000, lefthook)
```

### Makefile (non-pnpm targets)

```bash
make up/down/logs/ps/rebuild    # Docker Compose
make version/version-sync/...   # Version management (reads package.json)
make env/env-show               # Bootstrap .env.local / check placeholders
make hooks-install/hooks-run    # Lefthook git hooks
```

## Repository Structure

```
root/
├── app/                 # Next.js App Router (2 route groups)
├── components/          # React: docs/, layout/, lesson/ (MDX widgets), playground/, ui/
├── constants/           # Site config, category registry, sidebar, icons
├── content/             # ~123 MDX files across 11 categories
├── hooks/               # Lesson progress, clipboard, resizable sidebar, sidebar state
├── lib/                 # Content pipeline (source/tree/navigation/toc), MDX compiler, utils
├── scripts/             # new-lesson.mjs, validate-content.mjs, hooks/
├── types/               # Content & navigation type definitions
└── public/              # logo.svg
```

Key files: `components/lesson/mdx-registry.tsx` (single MDX component map), `constants/categories/` (category SSOT), `lib/content/tree.ts` (content tree builder), `lib/content/frontmatter-schema.mjs` (shared validator).

## Code Style

- **No semicolons.** Double quotes. Trailing commas (es5). 80 width. 2-space indent. LF endings.
- Prettier plugin `prettier-plugin-tailwindcss` reads from `app/globals.css`, recognizes `cn()`/`cva()`.
- `@/` path alias maps to project root. TypeScript strict.
- Section comment headers: `// ── Title ──` padded to 80 chars with dashes.
- ESLint 9 flat config — extends `core-web-vitals` + `typescript`. Ignores .next/, out/, build/.

## Architecture

### Route Groups

- **`(docs)`** — Full lesson experience. Header, resizable Sidebar, breadcrumbs, TOC (desktop), prev/next nav. Catch-all `[...slug]` renders lesson page or category index when no MDX file matches.
- **`(bare)`** — No chrome. `/preview/<content-path>` for clean previews.

### Content Pipeline

1. `lib/content/source.ts` reads MDX from disk. `getMdxSource()` cached via React `cache()`.
2. `lib/content/tree.ts` builds recursive `ContentNode` tree. Categories ordered by `CATEGORY_ORDER`. Lessons sorted by frontmatter `order`, then title.
3. Frontmatter parsed by gray-matter, validated by `lib/content/frontmatter-schema.mjs` (zero-dep hand-rolled validator — runs at runtime in dev + CI).
4. `lib/mdx.ts` — `compileMdx()` wraps `compileMDX` with: `remark-gfm`, `remarkStripLeadingH1`, `rehypeSlugify` (heading IDs), `rehype-highlight` (`ignoreMissing: true`).
5. `components/lesson/mdx-registry.tsx` — single MDX component map (widgets + UI primitives + HTML overrides).
6. `lib/navigation.ts` — converts content tree to `NavItem[]`, applies sidebar labels/groups.
7. SEO from frontmatter. `manifest.ts`, `robots.ts`, `sitemap.ts` use `SITE_CONFIG`.

### Theme System

- `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`.
- D key toggles dark/light (via `ThemeHotkey` — skips when typing in inputs/textarea/editable).
- CSS variables in `app/globals.css` use OKLCH. `.dark` class drives theme-aware styles.

## Content Authoring

### Frontmatter

Each MDX lesson at `content/<category>/<path>.mdx`:

```yaml
---
title: Lesson Title
description: One-line summary
order: 1 # sort order within directory
difficulty: beginner # beginner | intermediate | advanced
estimatedMinutes: 10
tags: []
updated: "2026-07-13" # MUST be quoted string — YAML parses unquoted dates
prerequisites: [] # optional content path refs e.g. ["react/intro"]
section: "" # optional sidebar section grouping
published: true # optional, defaults to true
---
```

**Always use `pnpm new:lesson <category/slug>`** to scaffold — handles ordering, frontmatter, file creation.

### Available MDX Widget Components

Registered in `components/lesson/mdx-registry.tsx`:

| Component                                                              | Source                    | Purpose                                       |
| ---------------------------------------------------------------------- | ------------------------- | --------------------------------------------- |
| `<LearningObjectives>`                                                 | shared/LearningObjectives | What reader will learn                        |
| `<LessonSummary>`                                                      | shared/LessonSummary      | Key takeaways                                 |
| `<LessonCodeExample>`                                                  | shared/LessonCodeExample  | Runnable code demo with explanation           |
| `<CodeBlock>`                                                          | shared/CodeBlock          | Syntax-highlighted code block                 |
| `<PreWithCopy>`                                                        | shared/PreWithCopy        | `<pre>` override with copy button             |
| `<Checklist>`                                                          | shared/Checklist          | Interactive checklist                         |
| `<StaticExercise>` / `<StaticChallenge>`                               | static/                   | Non-interactive exercise with solution reveal |
| `<InteractiveExercise>` / `<InteractiveChallenge>`                     | interactive/              | Live CodeMirror exercise/challenge            |
| `<LiveEditor>` / `<SandboxPreview>` / `<CodeMirrorEditor>`             | interactive/              | Live editing / preview / raw CodeMirror       |
| `<GalleryDemo>`                                                        | playground/GalleryDemo    | Interactive gallery demo                      |
| `<UseOptimisticDemo>` / `<UseActionStateDemo>` / `<UseTransitionDemo>` | playground/react19/       | React 19 live demos                           |
| `<Tabs>` / `<TabsContent>` / `<TabsList>` / `<TabsTrigger>`            | ui/tabs                   | Tabbed UI                                     |
| `<Alert>` / `<AlertDescription>` / `<AlertTitle>`                      | ui/alert                  | Callout boxes                                 |
| `<Badge>`                                                              | ui/badge                  | Status badges                                 |
| `<Info>` / `<AlertTriangle>` / `<Lightbulb>`                           | lucide-react              | Inline icons                                  |

### Content Validation

`pnpm validate:content` runs 7 checks on every MDX file:

1. **Frontmatter** — required fields + types/enums
2. **Internal links** — every `[text](/path)` resolves to real file or category directory
3. **Orphans** — no `.mdx` in top-level dir the sidebar can't map
4. **Heading hierarchy** — no skipped levels (h2 → h4)
5. **Code fences** — every ``` block declares a language
6. **Prerequisites** — every `prerequisites` entry resolves to a real lesson
7. **Ordering** — no duplicate `order` values within a directory

### Category Registration

Adding a new top-level category: update these 4 files **in order**:

1. `constants/categories/registry.mjs` — add to `CATEGORY_SLUGS`
2. `constants/categories/index.ts` — add entry to `CATEGORIES` + `CATEGORY_ORDER`
3. `constants/categories/sidebar.ts` — label in `SIDEBAR_LABELS` + entry in `SIDEBAR_SECTIONS`
4. `constants/categories/icons.ts` — Lucide icon name + Tailwind gradient

## Git Workflow

### Commit Convention

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.
Rules: imperative present tense, no period, lowercase after scope, body explains what/why not how.
Breaking: append `!` and add `BREAKING CHANGE:` footer. See `CONTRIBUTING.md` for full detail.

### Git Hooks (Lefthook)

Configured in `lefthook.yml`:

- **Hygiene** — trailing whitespace, EOF newline, merge conflict detection, JSON/YAML/TOML validation, private key detection, LF line endings
- **Prettier** — auto-formats staged `.ts|tsx|js|mjs|cjs|jsx|json|css|md|mdx`
- **ESLint** — auto-fixes staged `.ts|tsx|js|mjs|cjs|jsx`

Hooks run in parallel, only on staged files. Modified files are automatically re-staged via `stage_fixed`.

Install: `make hooks-install` or `pnpm lefthook install`.

## Environment Variables

`.env.example`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:4000
```

Copy to `.env.local` to override. `SITE_CONFIG.url` reads `NEXT_PUBLIC_SITE_URL` with fallback to `http://localhost:4000`.

## Critical Rules

These must never be violated:

1. **Scaffold lessons via `pnpm new:lesson`** — manual creation risks duplicate order values, wrong frontmatter schema, or missed file creation edge cases.
2. **Run `pnpm validate:content` before committing content changes** — broken links, orphans, or hierarchy issues silently break the build.
3. **Quote `updated` dates in frontmatter** — `updated: 2026-07-13` (unquoted) gets silently parsed into a Date object by YAML, producing wrong output.
4. **New categories require 4-file registry update** — creating a directory without updating registry causes orphan validation failure.
5. **Run `make check` (lint + typecheck) before commits** — CI gate; commits that fail checks should be rebased, not bypassed.
6. **Don't bypass Lefthook hooks** (`--no-verify` only for emergencies) — hooks auto-fix formatting and catch issues early.
7. **No commits directly to main** — use feature branches with conventional commit messages.

## Common Pitfalls

- **Order collisions:** Adding a lesson manually can duplicate `order` values. Always use `pnpm new:lesson`.
- **Unquoted `updated` dates:** YAML silently converts `updated: 2026-07-13` to a Date → leaks into JSON metadata as wrong type.
- **Orphan validation:** New top-level content directory without registry update → file exists but sidebar can't map it → CI fail.
- **Internal link targets:** Use content paths without `.mdx` extension (e.g. `[link](/react/intro)`), matching the URL path.
- **Lefthook stage_fixed:** Hooks that modify files (`prettier`, `eslint`) auto-re-stage changes via `stage_fixed: true`. Still prefer explicit `git add` for clarity.
- **`@/` alias in scripts:** Doesn't resolve in `.mjs` files under `scripts/` — use direct relative paths there.
- **Zero-dep validator:** `lib/content/frontmatter-schema.mjs` is shared between runtime and CI. Don't add imports from `gray-matter` or other runtime deps.

## AI Agent Instructions

- Use `pnpm new:lesson <category/slug>` for any content scaffolding — never create `.mdx` files manually.
- Use `@/` path alias for TypeScript imports (maps to project root).
- For new categories, update the 4 registry files in order (see Category Registration above).
- Content validation (`pnpm validate:content`) catches most content mistakes — run it before suggesting content changes are complete.
- `lib/content/frontmatter-schema.mjs` is the single source of truth for frontmatter validation rules.
- `components/lesson/mdx-registry.tsx` is where new MDX-accessible components are registered.
- Lefthook hooks auto-format staged files — prefer committing via `git commit` rather than `--no-verify`.
- When modifying the content pipeline (`lib/content/`), run `make check` to verify type/lint integrity.
