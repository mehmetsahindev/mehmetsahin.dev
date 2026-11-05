import type { Metadata } from "next"

import { PostList } from "@/features/admin/blog/post-list"
import { listPostsForAdmin } from "@/features/admin/blog/queries"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Blog" }

export default async function AdminBlogPage() {
  await requireAdmin()
  const posts = await listPostsForAdmin()

  return (
    <AdminPage>
      <PostList posts={posts} />
    </AdminPage>
  )
}
