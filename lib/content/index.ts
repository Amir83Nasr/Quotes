/**
 * Public surface of the content pipeline.
 * Re-exports from focused modules so `@/lib/content` keeps working:
 *  - source:     read MDX files + frontmatter
 *  - tree:       build/query the content tree
 *  - navigation: breadcrumbs + prev/next lesson navigation
 *  - toc:        heading extraction
 */
export { CONTENT_DIR, readFrontmatter, getMdxSource } from "./source"
export {
  getContentTree,
  getAllLessons,
  getContentNode,
} from "./tree"
export { buildBreadcrumbs, buildLessonNavigation } from "./navigation"
export { extractToc } from "./toc"
