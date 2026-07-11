"use client"

import { useRef, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  className?: string
}

const LANG_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  bash: "bash",
  shell: "bash",
  json: "json",
  css: "css",
  html: "xml",
  xml: "xml",
}

async function loadLang(hljs: typeof import("highlight.js"), lang: string) {
  const path: Record<string, string> = {
    javascript: "javascript",
    typescript: "typescript",
    bash: "bash",
    json: "json",
    css: "css",
    xml: "xml",
  }
  const p = path[lang]
  if (!p) return
  try {
    const mod = await import(`highlight.js/lib/languages/${p}`)
    hljs.default.registerLanguage(lang, mod.default)
  } catch { /* noop */ }
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard()
  const codeRef = useRef<HTMLElement>(null)
  const lang = language ? LANG_MAP[language] || language : undefined

  const handleCopy = () => copy(code)

  useEffect(() => {
    let dead = false
    if (!lang || !codeRef.current) return

    import("highlight.js/lib/core").then(async (hljs) => {
      if (dead) return
      await loadLang(hljs, lang)
      if (lang === "typescript") await loadLang(hljs, "javascript")

      if (!dead && codeRef.current) {
        codeRef.current.removeAttribute("data-highlighted")
        hljs.default.highlightElement(codeRef.current)
      }
    })

    return () => { dead = true }
  }, [code, lang])

  const lines = code.split("\n")

  return (
    <div className={cn("my-4 overflow-hidden rounded-lg border shadow-sm", className)}>
      {(title || language) && (
        <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
          <div className="flex items-center gap-2">
            {language && (
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {language}
              </span>
            )}
            {title && (
              <span className="text-xs text-muted-foreground">{title}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}

      <div className="relative">
        <pre className="code-surface overflow-x-auto p-4 text-sm">
          <code ref={codeRef} className={lang ? `language-${lang}` : undefined}>
            {lines.map((line, i) => (
              <span key={i} className="flex">
                {showLineNumbers && (
                  <span className="mr-4 inline-block w-8 shrink-0 text-right text-muted-foreground/50 select-none">
                    {i + 1}
                  </span>
                )}
                <span>{line || " "}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
