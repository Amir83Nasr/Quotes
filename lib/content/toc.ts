import type { TocHeading } from "@/types/navigation"
import { slugify } from "@/lib/utils"

/** Extract TOC headings from MDX source (quick regex, no full parse) */
export function extractToc(source: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: TocHeading[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length
    const text = match[2].replaceAll(/[`*_]/g, "").trim()
    const id = slugify(match[2])
    toc.push({ id, text, level })
  }

  return toc
}
