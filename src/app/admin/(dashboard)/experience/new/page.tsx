import type { Metadata } from "next"

import { ExperienceForm } from "@/features/admin/career/experience-form"
import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "New experience" }

export default async function NewExperiencePage() {
  await requireAdmin()

  return (
    <AdminPage className="pb-0 md:pb-0">
      <AdminPageHeader
        title="New experience"
        description="Add a company and the positions you held there."
      />
      <ExperienceForm id={null} initial={null} />
    </AdminPage>
  )
}
