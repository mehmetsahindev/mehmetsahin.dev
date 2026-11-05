"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLinkIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

import { findAdminNavItem } from "../config/nav"

export function AdminHeader() {
  const pathname = usePathname()
  const current = findAdminNavItem(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-line bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-center"
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/admin" />}>
              Admin
            </BreadcrumbLink>
          </BreadcrumbItem>
          {current && current.href !== "/admin" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{current.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <a href="/" target="_blank" rel="noopener">
              View site
              <ExternalLinkIcon />
            </a>
          }
        />
        <Separator
          orientation="vertical"
          className="data-vertical:h-4 data-vertical:self-center"
        />
        <ThemeToggle />
      </div>
    </header>
  )
}
