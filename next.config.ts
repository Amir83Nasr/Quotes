import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // ── Custom HTTP headers ──────────────────────────────────────────────
  async headers() {
    return [
      {
        // Service Worker: no-cache so clients pick up new versions quickly.
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        // Web App Manifest: no-cache so clients always get the latest.
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ]
  },
}

export default nextConfig
