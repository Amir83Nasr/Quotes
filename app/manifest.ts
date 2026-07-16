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
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    // Add screenshots after capturing them:
    //   screenshots/desktop.png  (1280x800, form_factor: "wide")
    //   screenshots/mobile.png   (390x844,  form_factor: "narrow")
  }
}
