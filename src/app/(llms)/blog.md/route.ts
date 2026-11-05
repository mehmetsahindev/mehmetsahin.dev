import { LOCALE_LABELS, LOCALES } from "@/i18n/config"

import { SITE_URL } from "@/config/site"
import { markdownResponse } from "@/lib/markdown-response"
import { getPublishedPosts } from "@/features/blog/data/queries"
import { postPath } from "@/features/blog/lib/paths"

export const dynamic = "force-dynamic"

export async function GET() {
  const sections = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      posts: await getPublishedPosts(locale),
    }))
  )

  return markdownResponse(`# Blog

> Stories, milestones, and things I learn along the way.

Each link below returns the full post as Markdown. Drop the \`.md\` extension for the web page.

${sections
  .filter(({ posts }) => posts.length > 0)
  .map(
    ({ locale, posts }) => `## ${LOCALE_LABELS[locale]} (${posts.length})

${posts
  .map(
    (item) =>
      `- [${item.title}](${SITE_URL}${postPath(locale, item.slug)}.md) (${item.publishedAt}): ${item.description}`
  )
  .join("\n")}`
  )
  .join("\n\n")}
`)
}
