"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"

interface FormState {
  ok: boolean
  message: string
}

/**
 * Live demo for the useActionState lesson.
 *
 * A subscribe form whose action returns a new state object. React tracks the
 * pending flag for us, so no manual useState/isLoading wiring is needed.
 * Validates the email and simulates a server round-trip.
 */
export function UseActionStateDemo() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const email = String(formData.get("email") ?? "").trim()
      await new Promise((r) => setTimeout(r, 900))
      if (!email.includes("@")) {
        return { ok: false, message: "Please enter a valid email address." }
      }
      return { ok: true, message: `Subscribed ${email} ✓` }
    },
    { ok: false, message: "" },
  )

  return (
    <form action={formAction} className="w-full max-w-sm space-y-3">
      <input
        name="email"
        type="text"
        placeholder="you@example.com"
        disabled={isPending}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
      />
      <Button type="submit" disabled={isPending} className="w-full gap-1.5">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Subscribing…
          </>
        ) : (
          "Subscribe"
        )}
      </Button>
      {state.message && (
        <p
          className={
            state.ok
              ? "flex items-center gap-1.5 text-sm text-green-600"
              : "text-sm text-destructive"
          }
        >
          {state.ok && <CheckCircle2 className="h-4 w-4" />}
          {state.message}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        The <code>isPending</code> flag comes straight from{" "}
        <code>useActionState</code> — no manual loading state. Try an email
        without an “@”.
      </p>
    </form>
  )
}
