import type { Category } from "@/types/content"
import { CATEGORY_SLUGS } from "./registry.mjs"

// Re-export focused config modules so `@/constants/categories` stays the
// single import surface for category/sidebar/icon data.
export { CATEGORY_ICONS, CATEGORY_COLORS } from "./icons"
export { SIDEBAR_LABELS, SIDEBAR_SECTIONS } from "./sidebar"
export { CATEGORY_SLUGS } from "./registry.mjs"

export const CATEGORIES: Category[] = [
  {
    id: "git",
    title: "Git & Version Control",
    description: "Track changes, collaborate, and never lose work — the developer's essential tool",
    icon: "GitBranch",
    color: "from-orange-600 to-red-500",
    href: "/git/intro",
    topics: [
      { name: "Introduction", href: "/git/intro" },
      { name: "Staging & Commits", href: "/git/staging-commits" },
      { name: "Branching & Merging", href: "/git/branching-merging" },
      { name: "Remotes & GitHub", href: "/git/remotes-github" },
      { name: "Resolving Merge Conflicts", href: "/git/merge-conflicts" },
      { name: "Undoing Changes", href: "/git/undoing-changes" },
      { name: "Rebasing", href: "/git/rebasing" },
    ],
  },
  {
    id: "web",
    title: "How the Web Works",
    description: "The foundation beneath every website — HTTP, DNS, browsers, and caching",
    icon: "Globe",
    color: "from-sky-500 to-indigo-500",
    href: "/web/how-the-web-works",
    topics: [
      { name: "How the Web Works", href: "/web/how-the-web-works" },
      { name: "HTTP Methods & Status", href: "/web/http" },
      { name: "HTTPS & TLS", href: "/web/https-tls" },
      { name: "DNS", href: "/web/dns" },
      { name: "Browser Rendering", href: "/web/browser-rendering" },
      { name: "DevTools", href: "/web/devtools" },
      { name: "Caching & CDNs", href: "/web/caching-cdns" },
    ],
  },
  {
    id: "react",
    title: "React",
    description: "Build modern user interfaces with React — hooks, components, and beyond",
    icon: "Atom",
    color: "from-cyan-500 to-blue-500",
    href: "/react/intro",
    topics: [
      { name: "Intro & JSX", href: "/react/intro" },
      { name: "Components & Props", href: "/react/components" },
      { name: "JSX Deep Dive", href: "/react/jsx-deep" },
      { name: "useState", href: "/react/hooks/use-state" },
      { name: "useEffect", href: "/react/hooks/use-effect" },
      { name: "useReducer", href: "/react/hooks/use-reducer" },
      { name: "useRef", href: "/react/hooks/use-ref" },
      { name: "Context", href: "/react/hooks/context" },
      { name: "useMemo & useCallback", href: "/react/hooks/use-memo-callback" },
      { name: "Custom Hooks", href: "/react/hooks/custom-hooks" },
      { name: "Compound Components", href: "/react/compound-components" },
      { name: "Portals & Suspense", href: "/react/portals-suspense" },
      { name: "Error Boundaries", href: "/react/error-boundaries" },
      { name: "Rendering Patterns", href: "/react/rendering-patterns" },
      { name: "React 19: use() API", href: "/react/react-19/use-api" },
      { name: "React 19: Form Actions", href: "/react/react-19/form-actions" },
      { name: "React 19: useOptimistic", href: "/react/react-19/use-optimistic" },
      { name: "React 19: useTransition", href: "/react/react-19/use-transition" },
      { name: "React 19: ref as Prop", href: "/react/react-19/ref-as-prop" },
    ],
  },
  {
    id: "nextjs",
    title: "Next.js",
    description: "React framework for production — routing, SSR, server components",
    icon: "FolderOpen",
    color: "from-neutral-800 to-neutral-600",
    href: "/nextjs/intro",
    topics: [
      { name: "Introduction", href: "/nextjs/intro" },
      { name: "App Router", href: "/nextjs/routing" },
      { name: "Server Components", href: "/nextjs/server-components" },
      { name: "Data Fetching", href: "/nextjs/data-fetching" },
      { name: "Layouts & Templates", href: "/nextjs/layouts-templates" },
      { name: "Loading & Error UI", href: "/nextjs/loading-error" },
      { name: "Route Handlers", href: "/nextjs/route-handlers" },
      { name: "Middleware", href: "/nextjs/middleware" },
      { name: "Image & Font Optimization", href: "/nextjs/image-optimization" },
      { name: "Server Actions", href: "/nextjs/server-actions" },
      { name: "Streaming & Suspense", href: "/nextjs/streaming-suspense" },
    ],
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    description: "Utility-first CSS for rapid, consistent UI development",
    icon: "Wind",
    color: "from-teal-500 to-cyan-500",
    href: "/tailwind/intro",
    topics: [
      { name: "Introduction", href: "/tailwind/intro" },
      { name: "Flexbox", href: "/tailwind/flexbox" },
      { name: "Grid", href: "/tailwind/grid" },
      { name: "Styling & Spacing", href: "/tailwind/styling" },
      { name: "Responsive Patterns", href: "/tailwind/responsive" },
      { name: "Dark Mode", href: "/tailwind/dark-mode" },
      { name: "Animations", href: "/tailwind/animations" },
      { name: "Composition Patterns", href: "/tailwind/composition" },
    ],
  },
  {
    id: "html",
    title: "HTML",
    description: "Structure the web with semantic markup and accessibility",
    icon: "FileCode",
    color: "from-orange-500 to-red-500",
    href: "/frontend/html/intro",
    topics: [
      { name: "Introduction", href: "/frontend/html/intro" },
      { name: "Forms & Validation", href: "/frontend/html/forms" },
      { name: "Semantic HTML", href: "/frontend/html/semantic" },
      { name: "Media Elements", href: "/frontend/html/media" },
      { name: "SEO & Meta Tags", href: "/frontend/html/seo-meta" },
      { name: "Accessibility & ARIA", href: "/frontend/html/a11y" },
    ],
  },
  {
    id: "css",
    title: "CSS",
    description: "Style and layout with modern CSS techniques",
    icon: "Palette",
    color: "from-blue-500 to-cyan-500",
    href: "/frontend/css/intro",
    topics: [
      { name: "Introduction", href: "/frontend/css/intro" },
      { name: "Layout", href: "/frontend/css/layout" },
      { name: "Flexbox", href: "/frontend/css/flexbox" },
      { name: "Grid", href: "/frontend/css/grid" },
      { name: "Responsive Design", href: "/frontend/css/responsive" },
      { name: "Custom Properties", href: "/frontend/css/custom-properties" },
      { name: "Animations", href: "/frontend/css/animations" },
      { name: "Cascade & Layers", href: "/frontend/css/layers-cascade" },
      { name: "Selectors", href: "/frontend/css/selectors" },
      { name: "Modern Color", href: "/frontend/css/modern-color" },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Master the language of the web — ES6+ and beyond",
    icon: "FileJson",
    color: "from-yellow-500 to-amber-500",
    href: "/frontend/javascript/intro",
    topics: [
      { name: "Introduction", href: "/frontend/javascript/intro" },
      { name: "Async/Await", href: "/frontend/javascript/async" },
      { name: "DOM Manipulation", href: "/frontend/javascript/dom" },
      { name: "Scopes & Closures", href: "/frontend/javascript/scopes-closures" },
      { name: "Prototypes & Classes", href: "/frontend/javascript/prototypes-classes" },
      { name: "Promises Deep Dive", href: "/frontend/javascript/promises-deep" },
      { name: "Async Patterns", href: "/frontend/javascript/async-patterns" },
      { name: "Event Loop", href: "/frontend/javascript/event-loop" },
      { name: "Array Methods", href: "/frontend/javascript/array-methods" },
      { name: "ES Modules", href: "/frontend/javascript/modules" },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript",
    description: "Type-safe JavaScript for scalable applications",
    icon: "FileType",
    color: "from-blue-600 to-indigo-600",
    href: "/frontend/typescript/intro",
    topics: [
      { name: "Introduction", href: "/frontend/typescript/intro" },
      { name: "Types & Interfaces", href: "/frontend/typescript/types" },
      { name: "Generics", href: "/frontend/typescript/generics" },
      { name: "Advanced Types", href: "/frontend/typescript/advanced" },
      { name: "Union & Intersection", href: "/frontend/typescript/union-intersection" },
      { name: "Type Guards", href: "/frontend/typescript/type-guards" },
      { name: "Mapped & Conditional Types", href: "/frontend/typescript/mapped-types" },
      { name: "Utility Types", href: "/frontend/typescript/utility-types" },
      { name: "Branded Types", href: "/frontend/typescript/branded-types" },
      { name: "Declaration Files", href: "/frontend/typescript/declaration-files" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Concepts",
    description: "State management, forms, performance, testing, and design patterns",
    icon: "Zap",
    color: "from-purple-500 to-violet-500",
    href: "/advanced/state-management",
    topics: [
      { name: "State Management", href: "/advanced/state-management" },
      { name: "Forms & Validation", href: "/advanced/forms" },
      { name: "Performance", href: "/advanced/performance" },
      { name: "Testing", href: "/advanced/testing" },
      { name: "Accessibility", href: "/advanced/accessibility" },
      { name: "Design Patterns", href: "/advanced/design-patterns" },
      { name: "Form Libraries", href: "/advanced/form-libraries" },
      { name: "State Mgmt Libraries", href: "/advanced/state-management-libraries" },
      { name: "Bundlers & Build", href: "/advanced/bundlers" },
      { name: "Monorepos", href: "/advanced/monorepos" },
      { name: "Modern Web APIs", href: "/advanced/web-apis" },
    ],
  },
  {
    id: "fullstack",
    title: "Full Stack",
    description: "APIs, auth, databases, and deployment",
    icon: "Server",
    color: "from-emerald-500 to-teal-500",
    href: "/fullstack/intro",
    topics: [
      { name: "Full Stack Overview", href: "/fullstack/intro" },
      { name: "Backend Integration", href: "/fullstack/backend" },
      { name: "Authentication", href: "/fullstack/authentication" },
      { name: "Deployment", href: "/fullstack/deployment" },
      { name: "Databases & ORMs", href: "/fullstack/databases" },
      { name: "File Upload", href: "/fullstack/file-upload" },
      { name: "Real-Time Features", href: "/fullstack/real-time" },
    ],
  },
  {
    id: "security",
    title: "Web Security",
    description: "Defend your apps against the most common attacks — XSS, CSRF, injection, and more",
    icon: "ShieldAlert",
    color: "from-red-600 to-rose-500",
    href: "/security/threat-model",
    topics: [
      { name: "Threat Model & OWASP", href: "/security/threat-model" },
      { name: "XSS", href: "/security/xss" },
      { name: "CSRF", href: "/security/csrf" },
      { name: "CORS & Same-Origin", href: "/security/cors" },
      { name: "Content Security Policy", href: "/security/csp" },
      { name: "Auth Security", href: "/security/auth-security" },
      { name: "Injection & Validation", href: "/security/injection" },
    ],
  },
  {
    id: "practice",
    title: "Practice Projects",
    description: "Build real projects to cement your knowledge",
    icon: "Code",
    color: "from-rose-500 to-pink-500",
    href: "/practice/todo-app",
    topics: [
      { name: "Todo App", href: "/practice/todo-app" },
      { name: "Expense Tracker", href: "/practice/expense-tracker" },
      { name: "Dashboard", href: "/practice/dashboard" },
      { name: "Authentication", href: "/practice/auth" },
      { name: "Blog", href: "/practice/blog" },
      { name: "Kanban Board", href: "/practice/kanban" },
    ],
  },
]

/**
 * Display order for top-level categories in the sidebar.
 * Lower = higher in the tree (pedagogical learning order).
 */
export const CATEGORY_ORDER: Record<string, number> = {
  git: 0,
  web: 1,
  frontend: 2,
  tailwind: 3,
  shadcn: 4,
  gallery: 5,
  react: 6,
  nextjs: 7,
  advanced: 8,
  fullstack: 9,
  security: 10,
  practice: 11,
}

/** Map of content directories to route prefixes, derived from the registry. */
export const CATEGORY_ROUTES: Record<string, string> = Object.fromEntries(
  CATEGORY_SLUGS.map((slug) => [slug, `/${slug}`]),
)

/** Get route prefix for a content directory */
export function getRouteForCategory(dir: string): string {
  return CATEGORY_ROUTES[dir] ?? `/${dir}`
}

/** Parse a content path into a URL */
export function contentPathToUrl(contentPath: string): string {
  const parts = contentPath.split("/")
  const category = parts[0]
  const route = getRouteForCategory(category)
  const rest = parts.slice(1).join("/")
  return rest ? `${route}/${rest}` : route
}
