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
import { GalleryDemo } from "@/components/playground/GalleryDemo"
import { UseOptimisticDemo } from "@/components/playground/react19/UseOptimisticDemo"
import { UseActionStateDemo } from "@/components/playground/react19/UseActionStateDemo"
import { UseTransitionDemo } from "@/components/playground/react19/UseTransitionDemo"
import { CodeBlock } from "./shared/CodeBlock"
import { LessonCodeExample } from "./shared/LessonCodeExample"
import { PreWithCopy } from "./shared/PreWithCopy"
import { LearningObjectives } from "./shared/LearningObjectives"
import { LessonSummary } from "./shared/LessonSummary"
import { LiveEditor } from "./interactive/LiveEditor"
import { SandboxPreview } from "./interactive/SandboxPreview"

export const lessonMdxComponents: MDXComponents = {
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

  GalleryDemo: GalleryDemo as React.ComponentType,
  UseOptimisticDemo: UseOptimisticDemo as React.ComponentType,
  UseActionStateDemo: UseActionStateDemo as React.ComponentType,
  UseTransitionDemo: UseTransitionDemo as React.ComponentType,

  CodeBlock: CodeBlock as React.ComponentType,
  LessonCodeExample: LessonCodeExample as React.ComponentType,
  LearningObjectives: LearningObjectives as React.ComponentType,
  LessonSummary: LessonSummary as React.ComponentType,

  LiveEditor: LiveEditor as React.ComponentType,
  SandboxPreview: SandboxPreview as React.ComponentType,

  table: ({ children, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border px-4 py-2 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-4 py-2 text-left" {...props}>
      {children}
    </td>
  ),
  pre: PreWithCopy as React.ComponentType<HTMLAttributes<HTMLPreElement>>,
  code: ({ children, className, ...props }: ComponentProps<"code">) => {
    const isInline = !className
    if (isInline) {
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
          {...props}
        >
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
    <blockquote
      className="my-4 border-l-4 border-muted-foreground/30 pl-4 text-muted-foreground italic"
      {...props}
    >
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

export function getLessonMdxComponents(
  extra?: Record<string, React.ComponentType>
): MDXComponents {
  return { ...lessonMdxComponents, ...extra }
}
