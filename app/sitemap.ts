import type { MetadataRoute } from "next"

import { SITE_CONFIG } from "@/constants/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date("2026-07-13"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
