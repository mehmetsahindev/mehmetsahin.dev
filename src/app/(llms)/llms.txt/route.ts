import { SITE_URL } from "@/config/site"
import { markdownResponse } from "@/lib/markdown-response"
import { getBlogPosts } from "@/features/doc/data/documents"
import { getProfile } from "@/features/portfolio/data/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const profile = await getProfile()
  const allPosts = getBlogPosts()

  return markdownResponse(`# ${profile.displayName}

> ${profile.bio}

- [About](${SITE_URL}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${SITE_URL}/experience.md): Highlights from my career and key roles I've taken on.
- [Education](${SITE_URL}/education.md): Where I studied and what I focused on.
- [Projects](${SITE_URL}/projects.md): Selected projects.
- [Blog](${SITE_URL}/blog.md): Every blog post, newest first, with publish dates.
- [Bookmarks](${SITE_URL}/bookmarks.md): Articles, courses, books, references, and tools I recommend.

## Blog

${allPosts.map((item) => `- [${item.metadata.title}](${SITE_URL}/blog/${item.slug}.md): ${item.metadata.description}`).join("\n")}
`)
}
