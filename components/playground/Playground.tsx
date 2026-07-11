import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlaygroundProps {
  children?: React.ReactNode
  title?: string
}

/**
 * Wrapper for interactive code examples within MDX lessons.
 * Renders children (React components) in a styled container.
 *
 * Usage in MDX:
 * ```mdx
 * <Playground>
 *   <CounterExample />
 * </Playground>
 * ```
 */
export function Playground({ children, title }: PlaygroundProps) {
  return (
    <Card className="my-6 overflow-hidden">
      <CardHeader className="border-b bg-muted/50 py-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">
            {title ?? "Live Preview"}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Interactive
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed p-6">
          {children ?? (
            <p className="text-sm text-muted-foreground">
              Add your component here.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
