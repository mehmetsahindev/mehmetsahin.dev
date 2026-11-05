import type { Metadata } from "next"

import { AdminPage } from "@/features/admin/components/admin-page"
import { requireAdmin } from "@/features/admin/lib/session"
import { SocialLinksManager } from "@/features/admin/social-links/social-links-manager"
import { getSocialLinks } from "@/features/portfolio/data/queries"

export const metadata: Metadata = { title: "Social links" }

export default async function AdminSocialLinksPage() {
  await requireAdmin()
  const links = await getSocialLinks()

  return (
    <AdminPage>
      <SocialLinksManager links={links} />
    </AdminPage>
  )
}
