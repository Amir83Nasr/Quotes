import type { ContentMeta, Frontmatter } from "./content"
import type { LessonNavigation } from "./navigation"

/** Props for the lesson page layout */
export interface LessonPageProps {
  meta: ContentMeta
  /** Rendered MDX content as React nodes */
  content: React.ReactNode
  /** Table of contents extracted from MDX */
  toc: { id: string; text: string; level: number }[]
  /** Previous/next navigation links */
  navigation: LessonNavigation
  /** Current content path */
  contentPath: string
}

/** MDX module shape loaded by content loader */
export interface MdxModule {
  frontmatter: Frontmatter
  default: React.ComponentType
  /** Named exports from MDX (e.g. playground components) */
  [key: string]: unknown
}

/** Exercise configuration */
export interface ExerciseConfig {
  title: string
  description: string
  starterCode: string
  solutionCode: string
  hints: string[]
  validation?: (code: string) => boolean
}

/** Challenge configuration */
export interface ChallengeConfig {
  title: string
  description: string
  requirements: string[]
  starterCode: string
  difficulty: "easy" | "medium" | "hard"
}

/** Playground component wrapper */
export interface PlaygroundComponent {
  id: string
  component: React.ComponentType
  label: string
  code: string
}
