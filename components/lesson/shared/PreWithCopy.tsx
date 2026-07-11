"use client"

import { useRef } from "react"
import { Check, Copy } from "lucide-react"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

/**
 * Wraps MDX <pre> code blocks with a copy-to-clipboard button.
 * Button appears on hover, stays visible briefly after copy.
 */
export function PreWithCopy({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const { copied, copy } = useCopyToClipboard()
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = () => {
    const code = preRef.current?.querySelector("code")
    copy(code?.textContent ?? "")
  }

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
          <Check className="size-3.5 text-green-500 dark:text-green-400" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
      <pre
        ref={preRef}
        className={
          "code-surface overflow-x-auto rounded-lg border p-4 text-sm shadow-sm " +
          (className ?? "")
        }
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
