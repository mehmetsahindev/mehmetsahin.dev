import type { Metadata } from "next"

import { BookmarksManager } from "@/features/admin/bookmarks/bookmarks-manager"
import {
  getBookmarkCategoriesForAdmin,
  getBookmarksForAdmin,
} from "@/features/admin/bookmarks/queries"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Bookmarks" }

export default async function AdminBookmarksPage() {
  await requireAdmin()
  const [bookmarks, categories] = await Promise.all([
    getBookmarksForAdmin(),
    getBookmarkCategoriesForAdmin(),
  ])

  return (
    <AdminPage>
      <BookmarksManager bookmarks={bookmarks} categories={categories} />
    </AdminPage>
  )
}
