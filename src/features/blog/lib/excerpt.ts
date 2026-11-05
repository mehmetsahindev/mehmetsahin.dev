/**
 * Plain-text summary of Markdown, used when a post has no description so
 * search results and link previews still get one.
 */
export function markdownExcerpt(markdown: string, maxLength = 160): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/^\s{0,3}#{1,6}\s.*$/gm, " ") // headings read badly in a summary
    .replace(/<[^>]+>/g, " ") // HTML and MDX tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their text
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/^\s{0,3}(>|[-*+]|\d+\.)\s+/gm, "") // block markers
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, "$1") // emphasis
    .replace(/\s+/g, " ")
    .trim()

  if (text.length <= maxLength) return text

  const cut = text.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, "")}…`
}

export function postDescription(post: {
  description: string
  content: string
}) {
  return post.description.trim() || markdownExcerpt(post.content)
}
