/** A single item in the sidebar navigation tree */
export interface NavItem {
  title: string
  href: string
  icon?: string
  children?: NavItem[]
  isActive?: boolean
  isExpanded?: boolean
  /** Metadata for display */
  badge?: string
  depth: number
  /** Difficulty level for lessons */
  difficulty?: "beginner" | "intermediate" | "advanced"
  /** Section group for visual separation (e.g., "foundations", "styling", "framework", "advanced") */
  section?: string
}

/** Breadcrumb segment */
export interface BreadcrumbItem {
  label: string
  href: string
  isCurrent: boolean
}

/** Table of contents heading */
export interface TocHeading {
  id: string
  text: string
  level: number
}

/** Previous/next navigation */
export interface LessonNavigation {
  prev: { title: string; href: string } | null
  next: { title: string; href: string } | null
}

/** Sidebar state */
export interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
}
