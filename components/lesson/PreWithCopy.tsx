"use client"

import { useState, useCallback, useRef } from "react"
import { Check, Copy } from "lucide-react"

/**
 * Wraps MDX <pre> code blocks with a copy-to-clipboard button.
 * Button appears on hover, stays visible briefly after copy.
 */
export function PreWithCopy({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = useCallback(() => {
    const code = preRef.current?.querySelector("code")
    const text = code?.textContent ?? ""
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div className="group relative my-4">
      <button
        onClick={handleCopy}
        className={
          "absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-md " +
          "bg-background/80 text-muted-foreground opacity-0 transition-opacity " +
          "hover:bg-accent hover:text-accent-foreground " +
          "group-hover:opacity-100 " +
          (copied ? "opacity-100" : "")
        }
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? (
          <Check className="size-3.5 text-green-400" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
      <pre
        ref={preRef}
        className={
          "overflow-x-auto rounded-lg border border-[#ffffff1a] p-4 text-sm " +
          (className ?? "")
        }
        style={{ backgroundColor: "#1e1e2e", color: "#e4e4e7" }}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
