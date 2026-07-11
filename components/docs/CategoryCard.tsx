"use client"

import Link from "next/link"
import type { Category } from "@/types/content"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"

interface CategoryCardProps {
  category: Category
}

/**
 * Homepage card for a learning category.
 * Uses Lucide icons by string name, falls back to BookOpen.
 * Shows progress bar based on completed lesson paths.
 */
function DynamicIcon({ name }: { name: string }) {
  const iconMap: Record<string, LucideIcon> = {
    Atom: Icons.Atom,
    FileCode: Icons.FileCode,
    Palette: Icons.Palette,
    FileJson: Icons.FileJson,
    FileType: Icons.FileType,
    FolderOpen: Icons.FolderOpen,
    Wind: Icons.Wind,
    Box: Icons.Box,
    Zap: Icons.Zap,
    Shield: Icons.Shield,
    Server: Icons.Server,
    Database: Icons.Database,
    Rocket: Icons.Rocket,
    Code: Icons.Code,
    BookOpen: Icons.BookOpen,
    GitBranch: Icons.GitBranch,
    FileInput: Icons.FileInput,
    Accessibility: Icons.Accessibility,
    Layers: Icons.Layers,
    TestTube: Icons.TestTube,
    Images: Icons.Images,
  }

  const Icon = iconMap[name] ?? Icons.BookOpen
  return <Icon className="h-5 w-5" />
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { isCompleted } = useProgress()

  const topicHrefs = category.topics.map((t) => t.href)
  const completedTopics = topicHrefs.filter((h) => isCompleted(h)).length
  const progressPct =
    topicHrefs.length > 0
      ? Math.round((completedTopics / topicHrefs.length) * 100)
      : 0

  return (
    <Link href={category.href}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${category.color} text-white`}
              >
                <DynamicIcon name={category.icon} />
              </div>
              <div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </div>
            </div>
            {progressPct > 0 && (
              <span className="text-xs text-muted-foreground">
                {completedTopics}/{topicHrefs.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <CardDescription className="mb-3 text-sm leading-relaxed">
            {category.description}
          </CardDescription>
          <div className="flex flex-wrap gap-1.5">
            {category.topics.slice(0, 3).map((topic) => (
              <Badge
                key={topic.name}
                variant="secondary"
                className="text-xs font-normal"
              >
                {topic.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
