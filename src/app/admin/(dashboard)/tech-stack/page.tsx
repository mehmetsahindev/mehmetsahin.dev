import type { Metadata } from "next"

import { getTechStackForAdmin } from "@/features/admin/career/queries"
import { TechStackManager } from "@/features/admin/career/tech-stack-manager"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Tech stack" }

export default async function AdminTechStackPage() {
  await requireAdmin()
  const categories = await getTechStackForAdmin()

  return (
    <AdminPage>
      <TechStackManager categories={categories} />
    </AdminPage>
  )
}
