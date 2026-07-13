/**
 * Centralized site configuration for the Quotes application.
 *
 * Change values here to update branding, URLs, and metadata across the
 * entire application.  For the production URL, set NEXT_PUBLIC_SITE_URL
 * in your environment or .env.local; otherwise localhost is used.
 */
export const SITE_CONFIG = {
  /** Application / brand name */
  name: "Quotes",

  /** Default page title */
  title: "Quotes — Discover & Share Inspiring Quotes",

  /** Default meta description */
  description:
    "Discover, save, and share the most inspiring quotes from great minds throughout history.",

  /** Base URL — override via NEXT_PUBLIC_SITE_URL env var */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000",

  /** Open Graph image path (relative to base URL) */
  ogImage: "/og.png",

  /** External links */
  links: {
    github: "",
    twitter: "",
  },
} as const
