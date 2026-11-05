import { LOCALE_TAGS } from "@/i18n/config"
import { getMessages } from "@/i18n/messages"
import { escapeXml } from "@/utils/string"

import { SITE_URL } from "@/config/site"
import { getPublishedPosts } from "@/features/blog/data/queries"
import { blogPath, postPath } from "@/features/blog/lib/paths"
import { getRequestLocale } from "@/features/blog/lib/request-locale"
import { getProfile } from "@/features/portfolio/data/queries"

export const dynamic = "force-dynamic"

/** `/blog/rss` and `/tr/blog/rss` (rewritten by src/proxy.ts). */
export async function GET(request: Request) {
  const locale = getRequestLocale(request)
  const t = getMessages(locale).blog
  const [profile, posts] = await Promise.all([
    getProfile(),
    getPublishedPosts(locale),
  ])

  const itemsXml = posts
    .map(
      (post) => `<item>
          <title>${escapeXml(post.title)}</title>
          <link>${SITE_URL}${postPath(locale, post.slug)}</link>
          <guid>${SITE_URL}${postPath(locale, post.slug)}</guid>
          <description>${escapeXml(post.summary)}</description>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
        </item>`
    )
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(`${t.title} | ${profile.displayName}`)}</title>
      <link>${SITE_URL}${blogPath(locale)}</link>
      <description>${escapeXml(t.description)}</description>
      <language>${LOCALE_TAGS[locale]}</language>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
