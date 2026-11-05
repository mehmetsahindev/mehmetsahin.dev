import type { Metadata } from "next"

import { ExperienceList } from "@/features/admin/career/experience-list"
import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"
import { getExperiences } from "@/features/portfolio/data/queries"

export const metadata: Metadata = { title: "Experience" }

export default async function AdminExperiencePage() {
  await requireAdmin()
  const items = await getExperiences()

  return (
    <AdminPage>
      <ExperienceList items={items} />
    </AdminPage>
  )
}
