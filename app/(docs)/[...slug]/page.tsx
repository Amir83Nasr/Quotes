import { notFound } from "next/navigation"
import { Suspense } from "react"
import { compileMdx } from "@/lib/mdx"
import {
  getMdxSource,
  getContentNode,
  getAllContentPaths,
  extractToc,
  buildBreadcrumbs,
  buildLessonNavigation,
} from "@/lib/content"
import { getLessonMdxComponents } from "@/components/lesson/mdx-registry"
import { Breadcrumb } from "@/components/docs/Breadcrumb"
import { TableOfContents } from "@/components/docs/TableOfContents"
import { CategoryIndex } from "@/components/docs/CategoryIndex"
import { LessonNav } from "./lesson-nav"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const paths = await getAllContentPaths()
  return paths.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const contentPath = slug.join("/")
  const source = await getMdxSource(contentPath)
  if (!source) {
    const node = await getContentNode(contentPath)
    if (node) return { title: node.title, description: node.description }
    return {}
  }

  const { frontmatter } = await compileMdx(source)
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params
  const contentPath = slug.join("/")

  const source = await getMdxSource(contentPath)
  if (!source) {
    // Check if this is a category directory with children
    const node = await getContentNode(contentPath)
    if (node && (node.children ?? []).length > 0) {
      return (
        <div className="mx-auto flex w-full max-w-7xl">
          <div className="min-w-0 flex-1 px-6 md:px-10 lg:px-16">
            <CategoryIndex node={node} />
          </div>
        </div>
      )
    }
    notFound()
  }

  const components = getLessonMdxComponents()
  const { content, frontmatter } = await compileMdx(source, components)
  const toc = extractToc(source)
  const breadcrumbs = await buildBreadcrumbs(contentPath)
  const navigation = await buildLessonNavigation(contentPath)

  return (
    <div className="mx-auto flex w-full max-w-7xl">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-4 py-6 md:px-10 lg:px-16">
        <article>
          <Breadcrumb items={breadcrumbs} />

          <header className="mb-6 md:mb-8">
            <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="text-lg text-muted-foreground">
                {frontmatter.description}
              </p>
            )}
          </header>

          <div className="prose-custom prose max-w-none min-w-0 wrap-break-word prose-neutral dark:prose-invert">
            {content}
          </div>

          <Separator className="my-8" />
          <LessonNav navigation={navigation} />
        </article>
      </div>

      {/* Table of Contents — desktop only */}
      <aside className="hidden xl:mr-4 xl:block xl:w-56 xl:shrink-0 2xl:mr-8">
        <Suspense fallback={null}>
          <TableOfContents headings={toc} />
        </Suspense>
      </aside>
    </div>
  )
}
