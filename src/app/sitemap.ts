import type { MetadataRoute } from "next"

import { SITE_URL } from "@/config/site"
import { getBlogPosts } from "@/features/doc/data/documents"

export const revalidate = false
export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.updatedAt).toISOString(),
  }))

  const routes = ["", "/blog", "/bookmarks"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...posts]
}
