import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert heading text into a URL-safe anchor `id`.
 *
 * Single source of truth shared by the rehype heading-id plugin (`lib/mdx.ts`)
 * and the ToC extractor (`lib/content/toc.ts`) so an in-page link and its
 * target heading always resolve to the same slug. Keeps CJK ideographs and
 * word characters, drops markdown emphasis markers, and collapses whitespace
 * to single hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^\w一-鿿\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
}
