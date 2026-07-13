import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

// Set basePath when building on GitHub Actions for Pages
const repo = process.env.GITHUB_REPOSITORY
if (repo) {
  const repoName = repo.split("/")[1]
  nextConfig.basePath = `/${repoName}`
  nextConfig.assetPrefix = `/${repoName}/`
}

export default nextConfig
