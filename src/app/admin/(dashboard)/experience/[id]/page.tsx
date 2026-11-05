import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { z } from "zod"

import { ExperienceForm } from "@/features/admin/career/experience-form"
import { getExperienceForAdmin } from "@/features/admin/career/queries"
import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Edit experience" }

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const parsed = z.uuid().safeParse((await params).id)
  const initial = parsed.success
    ? await getExperienceForAdmin(parsed.data)
    : null
  if (!parsed.success || !initial) notFound()

  return (
    <AdminPage className="pb-0 md:pb-0">
      <AdminPageHeader
        title={initial.values.companyName}
        description="Company details and positions."
      />
      <ExperienceForm id={parsed.data} initial={initial} />
    </AdminPage>
  )
}
