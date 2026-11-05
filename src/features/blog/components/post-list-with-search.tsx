"use client"

import { useFilteredPosts } from "../hooks/use-filtered-posts"
import type { PostSummary } from "../types"
import { PostList } from "./post-list"

export function PostListWithSearch({
  posts,
  emptyLabel,
}: {
  posts: PostSummary[]
  emptyLabel?: string
}) {
  const filteredPosts = useFilteredPosts(posts)
  return <PostList posts={filteredPosts} emptyLabel={emptyLabel} />
}
