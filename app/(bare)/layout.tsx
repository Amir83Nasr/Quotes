/**
 * Bare layout — no site Header or Sidebar.
 *
 * Route groups don't affect the URL, but each can carry its own layout.
 * The `(docs)` group wraps content in Header + full Sidebar; this `(bare)`
 * group renders content in isolation. Used for clean/preview views such as
 * `/preview/tailwind`.
 *
 * ThemeProvider already lives in the root layout, so nothing extra is needed
 * here beyond a centered content container.
 */
export default function BareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-3xl">{children}</main>
    </div>
  )
}
