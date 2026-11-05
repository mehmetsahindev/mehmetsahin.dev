import type { Route } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import {
  AdminPage,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"
import { ADMIN_NAV } from "@/features/admin/config/nav"
import { requireAdmin } from "@/features/admin/lib/session"

export default async function AdminOverviewPage() {
  const { user } = await requireAdmin()

  const sections = ADMIN_NAV.flatMap((group) => group.items).filter(
    (item) => item.href !== "/admin"
  )

  return (
    <AdminPage>
      <AdminPageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        description="Manage everything shown on your site from here."
      />

      <ul className="grid overflow-hidden rounded-xl border border-line sm:grid-cols-2">
        {sections.map((item) => {
          const Icon = item.icon

          return (
            <li
              key={item.href}
              className="border-b border-line last:border-b-0 sm:odd:border-r sm:nth-last-2:odd:border-b-0"
            >
              <Link
                href={item.href as Route}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-muted/50 text-muted-foreground [&_svg]:size-4">
                  <Icon />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {item.description}
                  </span>
                </div>
                <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          )
        })}
      </ul>
    </AdminPage>
  )
}
