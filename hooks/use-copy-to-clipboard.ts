"use client"

import { useCallback, useState } from "react"

/**
 * Shared copy-to-clipboard state used by code blocks.
 * Returns `copied` (true for `timeout` ms after a successful copy) and a
 * `copy(text)` action. Clipboard failures are swallowed so callers stay simple.
 */
export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
      } catch {
        /* clipboard unavailable (insecure context / denied permission) */
      }
    },
    [timeout],
  )

  return { copied, copy }
}
