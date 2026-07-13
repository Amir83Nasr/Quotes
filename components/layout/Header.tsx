"use client"

import Link from "next/link"
import { BookOpen, Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/hooks/use-sidebar"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import type { NavItem } from "@/types/navigation"
import { Search } from "@/components/docs/Search"

interface HeaderProps {
  navItems?: NavItem[]
}

export function Header({ navItems }: HeaderProps) {
  const { toggle } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center gap-2 font-semibold shrink-0">
          <BookOpen className="h-5 w-5" />
          <span className="hidden sm:inline-block">Quotes</span>
        </Link>

        {/* Search — centered on desktop */}
        {navItems && (
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <Search items={navItems} className="w-full max-w-md lg:max-w-lg" />
          </div>
        )}

        <div className="flex-1 md:hidden" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  )
}
