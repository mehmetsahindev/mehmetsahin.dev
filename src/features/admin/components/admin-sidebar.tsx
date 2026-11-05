"use client"

import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SiteMark } from "@/components/site-mark"

import type { AdminNavItem } from "../config/nav"
import { ADMIN_NAV, ADMIN_SETTINGS_ITEM, findAdminNavItem } from "../config/nav"
import { AdminUserMenu, type AdminUser } from "./admin-user-menu"

export function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname()
  const activeHref = findAdminNavItem(pathname)?.href

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-line *:data-[slot=sidebar-inner]:bg-background"
    >
      <SidebarHeader className="h-(--header-height) justify-center border-b border-line px-4 group-data-[collapsible=icon]:px-2">
        <Link
          href="/admin"
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
        >
          <SiteMark className="h-5 shrink-0" />
          <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase group-data-[collapsible=icon]:hidden">
            Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {ADMIN_NAV.map((group, index) => (
          <SidebarGroup key={group.label ?? index}>
            {group.label && (
              <SidebarGroupLabel className="font-mono tracking-wider uppercase">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={item.href === activeHref}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem
                item={ADMIN_SETTINGS_ITEM}
                isActive={ADMIN_SETTINGS_ITEM.href === activeHref}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-line">
        <AdminUserMenu user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function NavItem({
  item,
  isActive,
}: {
  item: AdminNavItem
  isActive: boolean
}) {
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.title}
        render={<Link href={item.href as Route} />}
      >
        <Icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
