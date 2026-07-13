/**
 * Friendly sidebar labels for directory slugs.
 * Falls back to node.title (which is derived from frontmatter or capitalized dir name).
 */
export const SIDEBAR_LABELS: Record<string, string> = {
  frontend: "Frontend Fundamentals",
  git: "Git & Version Control",
  web: "How the Web Works",
  advanced: "Advanced Concepts",
  fullstack: "Full Stack",
  security: "Web Security",
  practice: "Practice Projects",
  gallery: "Component Gallery",
  hooks: "Hooks",
  "react-19": "React 19",
  // Proper casing for tech names
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  typescript: "TypeScript",
  nextjs: "Next.js",
  shadcn: "shadcn/ui",
}

/**
 * Group top-level categories into labeled sections with dividers.
 * Lower order = renders first in the sidebar.
 *
 * `categories` lists the top-level content directory slugs mapped to each
 * section. HTML/CSS/JS/TS live under the `frontend` wrapper dir, so the
 * `frontend` node alone carries the Foundations section.
 */
export const SIDEBAR_SECTIONS: { label: string; order: number; categories: string[] }[] = [
  // `frontend` keeps the sidebar Foundations group (top-level content node),
  // while html/css/javascript/typescript are the CATEGORIES ids that render
  // as cards in the homepage "Your Learning Path" section 1.
  { label: "Foundations", order: 1, categories: ["git", "web", "frontend", "html", "css", "javascript", "typescript"] },
  { label: "Styling & UI", order: 2, categories: ["tailwind", "shadcn", "gallery"] },
  { label: "Core Framework", order: 3, categories: ["react", "nextjs"] },
  { label: "Advanced", order: 4, categories: ["advanced", "fullstack", "security"] },
  { label: "Projects", order: 5, categories: ["practice"] },
]
