import type { Metadata } from "next"

import { PostEditor } from "@/features/admin/blog/post-editor"
import { MarkdownPreviewRuntime } from "@/features/admin/blog/preview-runtime"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "New post" }

export default async function NewPostPage() {
  await requireAdmin()

  return (
    <AdminPage className="max-w-7xl">
      <PostEditor id={null} initial={null} />
      <MarkdownPreviewRuntime />
    </AdminPage>
  )
}
