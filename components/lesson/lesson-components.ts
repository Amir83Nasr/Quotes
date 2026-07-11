import type { MDXComponents } from "mdx/types"
import { Playground } from "@/components/playground/Playground"
import { CounterExample } from "@/components/playground/CounterExample"
import { GalleryDemo } from "@/components/playground/GalleryDemo"
import { CodeBlock } from "@/components/lesson/CodeBlock"
import { ExerciseCard } from "@/components/lesson/ExerciseCard"
import { ChallengeCard } from "@/components/lesson/ChallengeCard"
import { mdxComponents } from "./MdxComponents"

const customComponents = {
  Playground: Playground as React.ComponentType,
  CounterExample: CounterExample as React.ComponentType,
  GalleryDemo: GalleryDemo as React.ComponentType,
  CodeBlock: CodeBlock as React.ComponentType,
  ExerciseCard: ExerciseCard as React.ComponentType,
  ChallengeCard: ChallengeCard as React.ComponentType,
}

/**
 * Full MDX component map combining base HTML replacements
 * with custom lesson/playground components.
 */
export const lessonMdxComponents: MDXComponents = {
  ...mdxComponents,
  ...customComponents,
}

/**
 * Return appropriate components for MDX rendering.
 * Allows injecting page-specific components later.
 */
export function getLessonMdxComponents(
  extra?: Record<string, React.ComponentType>,
): MDXComponents {
  return {
    ...lessonMdxComponents,
    ...extra,
  }
}
