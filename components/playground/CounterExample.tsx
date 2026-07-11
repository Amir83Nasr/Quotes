"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function CounterExample() {
  const [count, setCount] = useState(0)

  return (
    <Card className="w-full max-w-sm p-6">
      <div className="flex flex-col items-center gap-4">
        <p className="text-4xl font-bold tabular-nums">{count}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCount((c) => c - 1)}
          >
            Decrement
          </Button>
          <Button size="sm" onClick={() => setCount((c) => c + 1)}>
            Increment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCount(0)}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}
