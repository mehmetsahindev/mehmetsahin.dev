import { escapeXml, toISODateSafe } from "@/utils/string"

import { SITE_URL } from "@/config/site"
import { getBlogPosts } from "@/features/doc/data/documents"
import { getProfile } from "@/features/portfolio/data/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const profile = await getProfile()
  const itemsXml = getBlogPosts()
    .map((doc) => {
      const pubDate = toISODateSafe(doc.metadata.createdAt)
      if (!pubDate) return null
      return `<item>
          <title>${escapeXml(doc.metadata.title)}</title>
          <link>${SITE_URL}/blog/${doc.slug}</link>
          <description>${escapeXml(doc.metadata.description || "")}</description>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .filter(Boolean)
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Blog | ${profile.displayName}</title>
      <link>${SITE_URL}/blog</link>
      <description>Stories, milestones, and things I learn along the way.</description>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}
