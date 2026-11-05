import type { Metadata } from "next"

import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"
import { HomeSectionsForm } from "@/features/admin/settings/home-sections-form"
import { getSiteSettings } from "@/features/portfolio/data/queries"

export const metadata: Metadata = { title: "Settings" }

export default async function AdminSettingsPage() {
  await requireAdmin()
  const settings = await getSiteSettings()

  return (
    <AdminPage>
      <AdminPageHeader title="Settings" description="Site-wide options." />
      <HomeSectionsForm initial={settings.homeSections} />
    </AdminPage>
  )
}
