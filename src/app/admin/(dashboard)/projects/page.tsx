import type { Metadata } from "next"

import { ProjectList } from "@/features/admin/career/project-list"
import { listProjectsForAdmin } from "@/features/admin/career/queries"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Projects" }

export default async function AdminProjectsPage() {
  await requireAdmin()
  const items = await listProjectsForAdmin()

  return (
    <AdminPage>
      <ProjectList items={items} />
    </AdminPage>
  )
}
