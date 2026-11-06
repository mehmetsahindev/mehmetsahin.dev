import type { MetadataRoute } from "next"

import { SITE_URL } from "@/config/site"
import { isNoindex } from "@/lib/indexing"

// SITE_NOINDEX is a runtime variable, so this cannot be generated at build.
export const dynamic = "force-dynamic"

export default function robots(): MetadataRoute.Robots {
  if (isNoindex()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
