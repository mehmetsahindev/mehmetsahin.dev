import type { Metadata } from "next"

import { EducationManager } from "@/features/admin/career/education-manager"
import { listEducationForAdmin } from "@/features/admin/career/queries"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Education" }

export default async function AdminEducationPage() {
  await requireAdmin()
  const items = await listEducationForAdmin()

  return (
    <AdminPage>
      <EducationManager items={items} />
    </AdminPage>
  )
}
