import type { MetadataRoute } from "next"

import { SITE_CONFIG } from "@/constants/site"

export const dynamic = "force-static"

const themeColor = "#0a0a0a"
const backgroundColor = "#ffffff"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.title,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    background_color: backgroundColor,
    theme_color: themeColor,
    orientation: "any",
    categories: ["education", "reference", "productivity"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Add screenshots after capturing them:
    //   screenshots/desktop.png  (1280x800, form_factor: "wide")
    //   screenshots/mobile.png   (390x844,  form_factor: "narrow")
  }
}
