import type { MetadataRoute } from "next"

import { getProfile } from "@/features/portfolio/data/queries"

export const dynamic = "force-dynamic"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await getProfile()

  return {
    short_name: profile.displayName,
    name: profile.displayName,
    description: profile.bio,
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
  }
}
