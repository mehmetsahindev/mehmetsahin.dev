import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { z } from "zod"

import { PostEditor } from "@/features/admin/blog/post-editor"
import { MarkdownPreviewRuntime } from "@/features/admin/blog/preview-runtime"
import { getPostForAdmin } from "@/features/admin/blog/queries"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Edit post" }

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const parsed = z.uuid().safeParse((await params).id)
  const initial = parsed.success ? await getPostForAdmin(parsed.data) : null
  if (!parsed.success || !initial) notFound()

  return (
    <AdminPage className="max-w-7xl">
      <PostEditor id={parsed.data} initial={initial} />
      <MarkdownPreviewRuntime />
    </AdminPage>
  )
}
