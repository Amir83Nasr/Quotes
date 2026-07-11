import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import type { MDXComponents } from "mdx/types"
import type { Frontmatter } from "@/types/content"
/**
 * Tiny rehype plugin: add `id` to heading elements so ToC links work.
 * Avoids a dependency on rehype-slug.
 */
function rehypeSlugify() {
  return (tree: any) => {
    function getText(node: any): string {
      if (node.type === "text") return node.value
      if (node.type === "element" && node.children) {
        return node.children.map(getText).join("")
      }
      return ""
    }
    function walk(nodes: any[]) {
      for (const node of nodes) {
        if (node.type !== "element") continue
        if (/^h[1-6]$/.test(node.tagName)) {
          const text = (node.children || []).map(getText).join("")
          node.properties = {
            ...node.properties,
            id: text
              .toLowerCase()
              .replace(/[`*_]/g, "")
              .replace(/[^\w一-鿿\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/^-+|-+$/g, ""),
          }
        }
        if (node.children) walk(node.children)
      }
    }
    walk(tree.children || [])
  }
}

/**
 * Compile an MDX string into React components.
 * Returns the compiled component along with parsed frontmatter.
 */
export async function compileMdx<TFrontmatter extends Frontmatter = Frontmatter>(
  source: string,
  components?: MDXComponents,
): Promise<{
  content: React.ReactElement
  frontmatter: TFrontmatter
}> {
  const { content, frontmatter } = await compileMDX<TFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlugify],
        format: "mdx" as const,
      },
    },
    components,
  })

  return { content, frontmatter }
}

/**
 * Strip MDX frontmatter for non-MDX processing (plain markdown rendering).
 */
export function stripFrontmatter(source: string): string {
  return source.replace(/^---[\s\S]*?---/, "").trim()
}
