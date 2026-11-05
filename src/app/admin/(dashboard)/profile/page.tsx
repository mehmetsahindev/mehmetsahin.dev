import type { Metadata } from "next"

import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"
import { ProfileForm } from "@/features/admin/profile/profile-form"
import { getProfileForAdmin } from "@/features/admin/profile/queries"

export const metadata: Metadata = { title: "Profile" }

export default async function AdminProfilePage() {
  await requireAdmin()
  const initial = await getProfileForAdmin()

  return (
    <AdminPage className="pb-0 md:pb-0">
      <AdminPageHeader
        title="Profile"
        description="Name, bio, avatar and contact details."
      />
      <ProfileForm initial={initial} />
    </AdminPage>
  )
}
