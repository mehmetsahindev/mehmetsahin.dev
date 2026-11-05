"use client"

import { useRouter } from "next/navigation"
import { ChevronsUpDownIcon, ExternalLinkIcon, LogOutIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export type AdminUser = {
  name: string
  email: string
  image?: string | null
}

export function AdminUserMenu({ user }: { user: AdminUser }) {
  const router = useRouter()
  const { isMobile } = useSidebar()

  const signOut = async () => {
    await authClient.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent"
              />
            }
          >
            <UserAvatar user={user} />
            <div className="grid flex-1 text-left text-sm/tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                <UserAvatar user={user} />
                <div className="grid flex-1 text-left text-sm/tight">
                  <span className="truncate font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<a href="/" target="_blank" />}>
              <ExternalLinkIcon />
              View site
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function UserAvatar({ user }: { user: AdminUser }) {
  return (
    <Avatar className="size-8 rounded-lg">
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback className="rounded-lg">
        {user.name.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
