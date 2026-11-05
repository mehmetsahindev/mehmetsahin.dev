import { LOCALE_LABELS, LOCALES } from "@/i18n/config"

import { SITE_URL } from "@/config/site"
import { markdownResponse } from "@/lib/markdown-response"
import { getPublishedPosts } from "@/features/blog/data/queries"
import { postPath } from "@/features/blog/lib/paths"
import { getProfile } from "@/features/portfolio/data/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const [profile, ...sections] = await Promise.all([
    getProfile(),
    ...LOCALES.map(async (locale) => ({
      locale,
      posts: await getPublishedPosts(locale),
    })),
  ])

  const blogSections = sections
    .filter(({ posts }) => posts.length > 0)
    .map(({ locale, posts }) => {
      const lines = posts.map(
        (item) =>
          `- [${item.title}](${SITE_URL}${postPath(locale, item.slug)}.md): ${item.summary}`
      )
      return `## Blog (${LOCALE_LABELS[locale]})\n\n${lines.join("\n")}`
    })
    .join("\n\n")

  return markdownResponse(`# ${profile.displayName}

> ${profile.bio}

- [About](${SITE_URL}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${SITE_URL}/experience.md): Highlights from my career and key roles I've taken on.
- [Education](${SITE_URL}/education.md): Where I studied and what I focused on.
- [Projects](${SITE_URL}/projects.md): Selected projects.
- [Blog](${SITE_URL}/blog.md): Every blog post, newest first, with publish dates.
- [Bookmarks](${SITE_URL}/bookmarks.md): Articles, courses, books, references, and tools I recommend.

${blogSections}
`)
}
