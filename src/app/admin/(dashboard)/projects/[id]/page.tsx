import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { z } from "zod"

import { ProjectForm } from "@/features/admin/career/project-form"
import { getProjectForAdmin } from "@/features/admin/career/queries"
import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = { title: "Edit project" }

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const parsed = z.uuid().safeParse((await params).id)
  const initial = parsed.success ? await getProjectForAdmin(parsed.data) : null
  if (!parsed.success || !initial) notFound()

  return (
    <AdminPage className="pb-0 md:pb-0">
      <AdminPageHeader title={initial.values.title} />
      <ProjectForm id={parsed.data} initial={initial} />
    </AdminPage>
  )
}
