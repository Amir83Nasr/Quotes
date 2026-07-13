import type { ContentNode } from "@/types/content"
import type { NavItem } from "@/types/navigation"
import {
  contentPathToUrl,
  SIDEBAR_LABELS,
  SIDEBAR_SECTIONS,
} from "@/constants/categories"
import { getContentTree } from "./content"
import { cache } from "react"

/**
 * Build a section→slug lookup for O(1) category→section mapping.
 */
function buildSectionLookup(): Record<string, string> {
  const lookup: Record<string, string> = {}
  for (const section of SIDEBAR_SECTIONS) {
    for (const cat of section.categories) {
      lookup[cat] = section.label
    }
  }
  return lookup
}

/**
 * Recursively convert a ContentNode tree into a NavItem tree.
 * Category-type nodes become expandable groups, lesson-type nodes become leaf links.
 */
function contentNodeToNavItem(
  node: ContentNode,
  currentPath?: string,
  sectionLookup?: Record<string, string>
): NavItem {
  const isLesson = node.type === "lesson"
  const href = isLesson ? contentPathToUrl(node.contentPath) : "#"

  // Recursively process children
  const children =
    node.children.length > 0
      ? node.children.map((child) =>
          contentNodeToNavItem(child, currentPath, sectionLookup)
        )
      : undefined

  // Active if this node matches the current path, or a descendant is active
  const isActive = currentPath ? href === currentPath : false
  const isExpanded =
    isActive ||
    (children ? children.some((c) => c.isActive || c.isExpanded) : false)

  // Apply friendly label from SIDEBAR_LABELS, fall back to node title
  const title = SIDEBAR_LABELS[node.slug] ?? node.title

  return {
    title,
    href,
    children,
    isActive,
    isExpanded,
    depth: node.depth,
    difficulty: node.difficulty,
    // Map top-level categories and their nested lessons to a section
    section:
      sectionLookup?.[node.slug] ??
      sectionLookup?.[node.contentPath.split("/")[0]],
  }
}

/**
 * Build sidebar navigation tree from the full content tree.
 */
export const getSidebarNav = cache(
  async (currentPath?: string): Promise<NavItem[]> => {
    const sectionLookup = buildSectionLookup()
    const tree = await getContentTree()
    return tree.map((node) =>
      contentNodeToNavItem(node, currentPath, sectionLookup)
    )
  }
)

/**
 * Build sidebar nav grouped by pedagogical sections.
 * Returns [{ section: "Foundations", items: [...] }, ...]
 */
export const getSidebarSections = cache(
  async (
    currentPath?: string
  ): Promise<{ label: string; items: NavItem[] }[]> => {
    const nav = await getSidebarNav(currentPath)
    const sectionMap = new Map<string, NavItem[]>()
    const nullItems: NavItem[] = []

    for (const item of nav) {
      if (item.section) {
        const existing = sectionMap.get(item.section) ?? []
        existing.push(item)
        sectionMap.set(item.section, existing)
      } else {
        nullItems.push(item)
      }
    }

    return SIDEBAR_SECTIONS.map(({ label }) => ({
      label,
      items: sectionMap.get(label) ?? [],
    })).filter((s) => s.items.length > 0)
  }
)

/** Flatten nav tree for search indexing */
export function flattenNavItems(items: NavItem[]): NavItem[] {
  const result: NavItem[] = []
  for (const item of items) {
    result.push({ ...item, children: undefined })
    if (item.children) {
      result.push(...flattenNavItems(item.children))
    }
  }
  return result
}
