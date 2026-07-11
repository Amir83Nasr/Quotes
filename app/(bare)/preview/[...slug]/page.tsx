import { notFound } from "next/navigation"
import { compileMdx } from "@/lib/mdx"
import { getMdxSource, getContentNode } from "@/lib/content"
import { getLessonMdxComponents } from "@/components/lesson/mdx-registry"
import { CategoryIndex } from "@/components/docs/CategoryIndex"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

/**
 * Isolated / "bare" content view — same MDX rendering as the docs lesson page,
 * but without Header, Sidebar, breadcrumbs, TOC, or lesson navigation.
 *
 * Accepts any content path, e.g. `/preview/tailwind` (category index) or
 * `/preview/tailwind/flexbox` (single lesson).
 */
export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params
  const contentPath = slug.join("/")

  const source = await getMdxSource(contentPath)

  // Category directory → render just its index (list of lessons), no chrome.
  if (!source) {
    const node = await getContentNode(contentPath)
    if (node && (node.children ?? []).length > 0) {
      return <CategoryIndex node={node} />
    }
    notFound()
  }

  const components = getLessonMdxComponents()
  const { content, frontmatter } = await compileMdx(source, components)

  return (
    <article className="px-4 py-8 md:px-8">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          {frontmatter.title}
        </h1>
        {frontmatter.description && (
          <p className="text-lg text-muted-foreground">
            {frontmatter.description}
          </p>
        )}
      </header>

      <div className="prose-custom prose prose-neutral dark:prose-invert max-w-none">
        {content}
      </div>
    </article>
  )
}
