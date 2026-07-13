"use client"

import { useOptimistic, useState, useRef, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface Message {
  id: number
  text: string
  status: "sending" | "sent"
}

/**
 * Live demo for the useOptimistic lesson.
 *
 * Messages appear instantly with a "sending…" state (the optimistic update),
 * then flip to "sent" after a simulated network round-trip. Shows how the UI
 * stays responsive while the real work happens in the background.
 */
export function UseOptimisticDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hey, this is a real message", status: "sent" },
  ])
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, text: string) => [
      ...current,
      { id: Date.now(), text, status: "sending" as const },
    ]
  )
  const inputRef = useRef<HTMLInputElement>(null)

  async function send(formData: FormData) {
    const text = String(formData.get("text") ?? "").trim()
    if (!text) return
    if (inputRef.current) inputRef.current.value = ""

    addOptimistic(text)
    // Simulate a slow server so the optimistic state is visible.
    await new Promise((r) => setTimeout(r, 1200))
    setMessages((prev) => [...prev, { id: Date.now(), text, status: "sent" }])
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 space-y-2">
        {optimisticMessages.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm"
          >
            <span>{m.text}</span>
            <span
              className={
                m.status === "sending"
                  ? "text-xs text-muted-foreground italic"
                  : "text-xs text-green-600"
              }
            >
              {m.status === "sending" ? "sending…" : "sent ✓"}
            </span>
          </div>
        ))}
      </div>
      <form
        action={(formData) => startTransition(() => send(formData))}
        className="flex gap-2"
      >
        <input
          ref={inputRef}
          name="text"
          placeholder="Type a message and hit send"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" size="sm" className="gap-1">
          <Send className="h-3.5 w-3.5" />
          Send
        </Button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        Notice the message appears <strong>instantly</strong> as “sending…”,
        then confirms after the simulated 1.2s server delay.
      </p>
    </div>
  )
}
