import type {
  ComponentProps,
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react"
import type { MDXComponents } from "mdx/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info, AlertTriangle, Lightbulb } from "lucide-react"
// Playground demos
import { Playground } from "@/components/playground/Playground"
import { CounterExample } from "@/components/playground/CounterExample"
import { GalleryDemo } from "@/components/playground/GalleryDemo"
// Shared lesson primitives
import { CodeBlock } from "./shared/CodeBlock"
import { PreWithCopy } from "./shared/PreWithCopy"
import { Quiz } from "./shared/Quiz"
import { LearningObjectives } from "./shared/LearningObjectives"
import { LessonSummary } from "./shared/LessonSummary"
// Static (non-interactive) lesson widgets
import { StaticExercise } from "./static/StaticExercise"
import { StaticChallenge } from "./static/StaticChallenge"
// Interactive lesson widgets
import { InteractiveExercise } from "./interactive/InteractiveExercise"
import { InteractiveChallenge } from "./interactive/InteractiveChallenge"
import { LiveEditor } from "./interactive/LiveEditor"
import { SandboxPreview } from "./interactive/SandboxPreview"

/**
 * Single source of truth for the MDX component map.
 *
 * Combines three things:
 *  1. UI primitives + lesson widgets addressable by name inside MDX
 *     (e.g. `<Quiz>`, `<InteractiveExercise>`, `<Tabs>`).
 *  2. Raw HTML element overrides (`table`, `pre`, `code`, `a`, …) so plain
 *     Markdown renders with the site's styling.
 *
 * Keys used by content must stay stable — `InteractiveExercise`, `Quiz`,
 * `LearningObjectives`, `LessonSummary`, `SandboxPreview`, `GalleryDemo`,
 * `Playground`, `CounterExample` all appear in `.mdx` files.
 */
export const lessonMdxComponents: MDXComponents = {
  // UI primitives
  Tabs: Tabs as React.ComponentType,
  TabsContent: TabsContent as React.ComponentType,
  TabsList: TabsList as React.ComponentType,
  TabsTrigger: TabsTrigger as React.ComponentType,
  Badge: Badge as React.ComponentType,
  Alert: Alert as React.ComponentType,
  AlertDescription: AlertDescription as React.ComponentType,
  AlertTitle: AlertTitle as React.ComponentType,
  Info: Info as React.ComponentType,
  AlertTriangle: AlertTriangle as React.ComponentType,
  Lightbulb: Lightbulb as React.ComponentType,

  // Playground demos
  Playground: Playground as React.ComponentType,
  CounterExample: CounterExample as React.ComponentType,
  GalleryDemo: GalleryDemo as React.ComponentType,

  // Shared lesson widgets
  CodeBlock: CodeBlock as React.ComponentType,
  Quiz: Quiz as React.ComponentType,
  LearningObjectives: LearningObjectives as React.ComponentType,
  LessonSummary: LessonSummary as React.ComponentType,

  // Static (non-interactive) widgets
  StaticExercise: StaticExercise as React.ComponentType,
  StaticChallenge: StaticChallenge as React.ComponentType,

  // Interactive widgets
  InteractiveExercise: InteractiveExercise as React.ComponentType,
  InteractiveChallenge: InteractiveChallenge as React.ComponentType,
  LiveEditor: LiveEditor as React.ComponentType,
  SandboxPreview: SandboxPreview as React.ComponentType,

  // Raw HTML element overrides
  table: ({ children, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border px-4 py-2 text-left font-medium [[align=center]]:text-center [[align=right]]:text-right" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right" {...props}>
      {children}
    </td>
  ),
  pre: PreWithCopy as React.ComponentType<HTMLAttributes<HTMLPreElement>>,
  code: ({ children, className, ...props }: ComponentProps<"code">) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  blockquote: ({ children, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-4 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: ComponentProps<"a">) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
}

/**
 * Return components for MDX rendering, optionally injecting page-specific ones.
 */
export function getLessonMdxComponents(
  extra?: Record<string, React.ComponentType>,
): MDXComponents {
  return {
    ...lessonMdxComponents,
    ...extra,
  }
}
