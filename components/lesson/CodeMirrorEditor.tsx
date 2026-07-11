"use client"

import { useCallback, useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

// Module-level cache — loaded once, shared across all instances
let _EV: typeof import("@codemirror/view").EditorView | null = null
let _ES: typeof import("@codemirror/state").EditorState | null = null
let _setup: import("@codemirror/state").Extension | null = null
let _oneDark: import("@codemirror/state").Extension | null = null
let _js: ((cfg?: { typescript?: boolean; jsx?: boolean }) => import("@codemirror/state").Extension) | null = null
let _html: import("@codemirror/state").Extension | null = null
let _css: import("@codemirror/state").Extension | null = null

async function loadCodeMirror() {
  if (_EV) return
  const [view, state, setup, dark, jsMod, htmlMod, cssMod] = await Promise.all([
    import("@codemirror/view"),
    import("@codemirror/state"),
    import("@codemirror/basic-setup").then((m) => m.basicSetup as import("@codemirror/state").Extension),
    import("@codemirror/theme-one-dark").then((m) => m.oneDark as import("@codemirror/state").Extension),
    import("@codemirror/lang-javascript"),
    import("@codemirror/lang-html").then((m) => m.html() as import("@codemirror/state").Extension),
    import("@codemirror/lang-css").then((m) => m.css() as import("@codemirror/state").Extension),
  ])
  _EV = view.EditorView
  _ES = state.EditorState
  _setup = setup
  _oneDark = dark
  _js = (cfg) => jsMod.javascript(cfg) as import("@codemirror/state").Extension
  _html = htmlMod
  _css = cssMod
}

interface CodeMirrorEditorProps {
  code: string
  onChange?: (code: string) => void
  language: "javascript" | "typescript" | "html" | "css" | "tsx" | "jsx"
  readOnly: boolean
  height: number
  className?: string
}

function getLanguageExtension(lang: CodeMirrorEditorProps["language"]) {
  if (!_js || !_html || !_css) return []
  switch (lang) {
    case "javascript":
      return [_js()]
    case "typescript":
      return [_js({ typescript: true })]
    case "tsx":
      return [_js({ typescript: true, jsx: true })]
    case "jsx":
      return [_js({ jsx: true })]
    case "html":
      return [_html]
    case "css":
      return [_css]
    default:
      return [_js()]
  }
}

export default function CodeMirrorEditor({
  code,
  onChange,
  language,
  readOnly,
  height,
  className,
}: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<import("@codemirror/view").EditorView | null>(null)
  const [loaded, setLoaded] = useState(false)
  const { resolvedTheme } = useTheme()

  // Load CodeMirror modules once
  useEffect(() => {
    loadCodeMirror().then(() => setLoaded(true))
  }, [])

  // Create/destroy editor view
  useEffect(() => {
    if (!loaded || !editorRef.current || !_EV || !_ES || !_setup) return

    const isDark = resolvedTheme === "dark"

    const extensions: import("@codemirror/state").Extension[] = [
      _setup,
      _EV.editable.of(!readOnly),
      _EV.theme(
        {
          "&": { height: `${height}px`, fontSize: "14px", fontFamily: "var(--font-mono, monospace)" },
          ".cm-scroller": { fontFamily: "var(--font-mono, monospace)" },
          ".cm-content": { caretColor: isDark ? "#fff" : "#000", padding: "8px 0" },
          "&.cm-editor.cm-focused": { outline: "none" },
          ".cm-gutters": { borderRight: "none" },
        },
        { dark: isDark },
      ),
      ...(isDark && _oneDark ? [_oneDark] : []),
      ...getLanguageExtension(language),
    ]

    if (onChange) {
      extensions.push(
        _EV.updateListener.of((update) => {
          if (update.docChanged) onChange(update.state.doc.toString())
        }),
      )
    }

    const state = _ES.create({ doc: code, extensions })

    viewRef.current = new _EV({ state, parent: editorRef.current })

    return () => {
      viewRef.current?.destroy()
      viewRef.current = null
    }
    // Only re-create on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  // Sync code prop → editor (for resets, solution reveals)
  useEffect(() => {
    if (!viewRef.current || !loaded) return
    const doc = viewRef.current.state.doc.toString()
    if (doc !== code) {
      viewRef.current.dispatch({
        changes: { from: 0, to: doc.length, insert: code },
      })
    }
  }, [code, loaded])

  if (!loaded) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground", className)}
        style={{ height }}
      >
        Loading editor...
      </div>
    )
  }

  return (
    <div
      ref={editorRef}
      className={cn("overflow-hidden rounded-lg border bg-background", readOnly && "opacity-75", className)}
    />
  )
}
