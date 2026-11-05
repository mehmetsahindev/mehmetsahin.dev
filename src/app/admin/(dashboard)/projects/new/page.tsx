import type { Metadata } from "next"

import { ProjectForm } from "@/features/admin/career/project-form"
import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "New project" }

export default async function NewProjectPage() {
  await requireAdmin()

  return (
    <AdminPage className="pb-0 md:pb-0">
      <AdminPageHeader title="New project" />
      <ProjectForm id={null} initial={null} />
    </AdminPage>
  )
}
