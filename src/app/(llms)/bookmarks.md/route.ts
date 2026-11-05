import { SITE_URL } from "@/config/site"
import { markdownResponse } from "@/lib/markdown-response"
import {
  getBookmarkCategories,
  getBookmarks,
} from "@/features/portfolio/data/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const [categories, bookmarks] = await Promise.all([
    getBookmarkCategories(),
    getBookmarks(),
  ])

  const sections = categories
    .map((category) => ({
      category,
      items: bookmarks.filter((item) => item.category.id === category.id),
    }))
    .filter(({ items }) => items.length > 0)

  return markdownResponse(`# Bookmarks

> Hand-picked articles, courses, books, references, and tools worth your time.

${bookmarks.length} bookmarks in total, grouped by category. They are also listed on ${SITE_URL}/bookmarks, filterable by category.

${sections
  .map(
    ({ category, items }) => `## ${category.name} (${items.length})

${items
  .map(
    (item) =>
      `- [${item.title}](${item.url})${item.author ? ` by ${item.author}` : ""} (${item.bookmarkedAt})${item.note ? `\n  ${item.note}` : ""}`
  )
  .join("\n")}`
  )
  .join("\n\n")}
`)
}
