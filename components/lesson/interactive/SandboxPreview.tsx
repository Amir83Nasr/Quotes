"use client"

import { useMemo, useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type PreviewType = "html" | "css" | "javascript" | "mixed"

interface SandboxPreviewProps {
  html?: string
  css?: string
  js?: string
  type?: PreviewType
  title?: string
  height?: number
  className?: string
}

function buildSrcdoc(
  html: string,
  css: string,
  js: string,
  type: PreviewType
): string {
  const safeHtml = html || ""
  const styleTag = css ? `<style>${css}</style>` : ""
  // Use a unique sentinel to avoid </script> issues in srcdoc
  const safeJs = js || ""

  const baseHead = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`

  if (type === "css") {
    return `<!DOCTYPE html><html><head>${baseHead}${styleTag}</head><body><div class="preview-wrapper">${safeHtml || "<p>Add HTML to preview CSS</p>"}</div></body></html>`
  }

  if (type === "javascript") {
    return `<!DOCTYPE html><html><head>${baseHead}<style>body{font-family:system-ui,sans-serif;padding:16px;margin:0}</style></head><body>${safeHtml || '<div id="app"><p>JS output appears here</p></div>'}<script>try{${safeJs}}catch(e){document.body.innerHTML+='<pre style=\"color:red\">Error: '+e.message+'</pre>'}<\/script></body></html>`
  }

  // mixed / html
  const scriptTag = safeJs
    ? `<script>try{${safeJs}}catch(e){document.body.innerHTML+='<pre style="color:red;background:#fee;padding:8px;border-radius:4px">Error: '+e.message+'</pre>'}<\/script>`
    : ""

  return [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    baseHead,
    styleTag,
    "<style>body{font-family:system-ui,sans-serif;padding:16px;margin:0}pre{background:#f5f5f5;padding:8px;border-radius:4px;overflow-x:auto}</style>",
    "</head>",
    "<body>",
    safeHtml,
    scriptTag,
    "</body>",
    "</html>",
  ].join("")
}

/**
 * Sandboxed iframe preview for HTML/CSS/JS code.
 * Uses srcdoc to avoid cross-origin issues and sandbox for security.
 * Key idea: students can see their code changes instantly in the iframe.
 */
export function SandboxPreview({
  html = "",
  css = "",
  js = "",
  type = "mixed",
  title,
  height = 300,
  className,
}: SandboxPreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // expandedHeight only computed on interaction, not during SSR
  const [expandedHeight, setExpandedHeight] = useState(600)

  const srcdoc = useMemo(
    () => buildSrcdoc(html, css, js, type),
    [html, css, js, type]
  )

  const handleRefresh = useCallback(() => {
    setError(null)
    setKey((k) => k + 1)
  }, [])

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => {
      if (!prev) {
        const vh = typeof window !== "undefined" ? window.innerHeight : 900
        setExpandedHeight(Math.min(vh * 0.7, 800))
      }
      return !prev
    })
  }, [])

  const displayHeight = expanded ? expandedHeight : height

  return (
    <div className={cn("my-4 overflow-hidden rounded-lg border", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {title || "Live Preview"}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRefresh}
            aria-label="Refresh preview"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={toggleExpand}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview iframe */}
      {error ? (
        <div className="flex items-center justify-center gap-2 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      ) : (
        <iframe
          key={key}
          ref={iframeRef}
          srcDoc={srcdoc}
          sandbox="allow-scripts"
          title={title || "Live Preview"}
          className="w-full bg-white"
          style={{
            height: `${displayHeight}px`,
            transition: "height 0.2s ease",
          }}
        />
      )}
    </div>
  )
}
