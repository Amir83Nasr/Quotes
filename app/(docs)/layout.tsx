import { SidebarProvider } from "@/hooks/use-sidebar"
import { Header } from "@/components/layout/Header"
import { DocsLayout } from "./docs-layout"
import { getSidebarNav, getSidebarSections } from "@/lib/navigation"

export default async function DocsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [navItems, groups] = await Promise.all([
    getSidebarNav(),
    getSidebarSections(),
  ])

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header navItems={navItems} />
        <div className="flex flex-1">
          <DocsLayout groups={groups}>{children}</DocsLayout>
        </div>
      </div>
    </SidebarProvider>
  )
}
