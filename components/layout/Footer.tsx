import Link from "next/link"

const footerLinks = [
  { label: "React", href: "/react/intro" },
  { label: "Next.js", href: "/nextjs/routing" },
  { label: "Tailwind CSS", href: "/tailwind/flexbox" },
  { label: "Advanced", href: "/advanced/state-management" },
  { label: "Practice", href: "/practice/todo-app" },
  { label: "Component Gallery", href: "/gallery/buttons" },
]

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-2 font-semibold">Frontend Learning</h3>
            <p className="text-sm text-muted-foreground">
              Master frontend development through interactive lessons and
              hands-on projects.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-3 text-sm font-medium">About</h4>
            <p className="text-sm text-muted-foreground">
              A personal learning platform for frontend and full-stack
              development. Built with Next.js, TypeScript, Tailwind CSS,
              and shadcn/ui.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Frontend Learning Platform
        </div>
      </div>
    </footer>
  )
}
