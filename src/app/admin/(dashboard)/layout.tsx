import type { Metadata } from "next"
import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminHeader } from "@/features/admin/components/admin-header"
import { AdminSidebar } from "@/features/admin/components/admin-sidebar"
import { requireAdmin } from "@/features/admin/lib/session"

export const metadata: Metadata = {
  title: {
    template: "%s – Admin",
    default: "Admin",
  },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireAdmin()
  const sidebarState = (await cookies()).get("sidebar_state")?.value

  return (
    <SidebarProvider defaultOpen={sidebarState !== "false"}>
      <AdminSidebar
        user={{ name: user.name, email: user.email, image: user.image }}
      />
      <SidebarInset>
        <AdminHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
