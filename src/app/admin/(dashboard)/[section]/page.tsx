import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ConstructionIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { findAdminNavItem } from "@/features/admin/config/nav"
import { requireAdmin } from "@/features/admin/lib/session"

// Placeholder for sections that are not built yet. Each section gets its own
// static route folder later, which takes precedence over this dynamic one.

type Props = { params: Promise<{ section: string }> }

function getSection(section: string) {
  const item = findAdminNavItem(`/admin/${section}`)
  return item && item.href === `/admin/${section}` ? item : undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getSection((await params).section)
  return { title: item?.title }
}

export default async function AdminSectionPlaceholder({ params }: Props) {
  await requireAdmin()

  const item = getSection((await params).section)

  if (!item) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminPageHeader title={item.title} description={item.description} />

      <Empty className="border border-dashed border-line">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ConstructionIcon />
          </EmptyMedia>
          <EmptyTitle>Not built yet</EmptyTitle>
          <EmptyDescription>
            This section will be available in an upcoming phase.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </AdminPage>
  )
}
