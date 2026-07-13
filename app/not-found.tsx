import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
        <p className="mb-6 text-muted-foreground">
          Page not found. The lesson or topic you&apos;re looking for
          doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
