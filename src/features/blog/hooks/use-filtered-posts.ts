import type { PostSummary } from "../types"
import { useSearchQuery } from "./use-search-query"

const normalize = (text: string) => text.toLocaleLowerCase().replaceAll(" ", "")

const matchesQuery = (post: PostSummary, normalizedQuery: string) => {
  const normalizedTitle = normalize(post.title)
  const normalizedDescription = normalize(post.description)

  return (
    normalizedTitle.includes(normalizedQuery) ||
    normalizedDescription.includes(normalizedQuery)
  )
}

const searchPosts = (posts: PostSummary[], query: string | null) => {
  if (!query) return posts

  const normalizedQuery = normalize(query)
  return posts.filter((post) => matchesQuery(post, normalizedQuery))
}

export function useFilteredPosts(posts: PostSummary[]) {
  const { query } = useSearchQuery()
  return searchPosts(posts, query)
}
