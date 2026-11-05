import type { Metadata } from "next"
import { formatBytes } from "@/utils/format"

import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"
import { MediaLibrary } from "@/features/media/components/media-library"
import { listMedia } from "@/features/media/data/media"

export const metadata: Metadata = {
  title: "Media",
}

export default async function AdminMediaPage() {
  await requireAdmin()

  const items = await listMedia()
  const totalSize = items.reduce((sum, item) => sum + item.size, 0)

  return (
    <AdminPage>
      <AdminPageHeader
        title="Media"
        description={
          items.length > 0
            ? `${items.length} ${items.length === 1 ? "file" : "files"}, ${formatBytes(totalSize)} in total.`
            : "Every uploaded file and where it is used."
        }
      />
      <MediaLibrary items={items} />
    </AdminPage>
  )
}
