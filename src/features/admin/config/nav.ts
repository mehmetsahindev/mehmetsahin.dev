import type { LucideIcon } from "lucide-react"
import {
  AtSignIcon,
  BookmarkIcon,
  BriefcaseBusinessIcon,
  FileTextIcon,
  FolderGit2Icon,
  GraduationCapIcon,
  ImageIcon,
  LayersIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react"

export type AdminNavItem = {
  title: string
  href: `/admin${string}`
  icon: LucideIcon
  /** One-line summary shown under the page title. */
  description: string
}

export type AdminNavGroup = {
  label?: string
  items: AdminNavItem[]
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    items: [
      {
        title: "Overview",
        href: "/admin",
        icon: LayoutDashboardIcon,
        description: "A quick look at your content.",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Blog",
        href: "/admin/blog",
        icon: FileTextIcon,
        description: "Write and translate posts.",
      },
      {
        title: "Bookmarks",
        href: "/admin/bookmarks",
        icon: BookmarkIcon,
        description: "Links worth sharing.",
      },
    ],
  },
  {
    label: "Profile",
    items: [
      {
        title: "Profile",
        href: "/admin/profile",
        icon: UserRoundIcon,
        description: "Name, bio, avatar and contact details.",
      },
      {
        title: "Social links",
        href: "/admin/social-links",
        icon: AtSignIcon,
        description: "Profiles shown on the home page and footer.",
      },
    ],
  },
  {
    label: "Career",
    items: [
      {
        title: "Experience",
        href: "/admin/experience",
        icon: BriefcaseBusinessIcon,
        description: "Companies and positions.",
      },
      {
        title: "Education",
        href: "/admin/education",
        icon: GraduationCapIcon,
        description: "Schools and degrees.",
      },
      {
        title: "Projects",
        href: "/admin/projects",
        icon: FolderGit2Icon,
        description: "Things you have built.",
      },
      {
        title: "Tech stack",
        href: "/admin/tech-stack",
        icon: LayersIcon,
        description: "Languages, frameworks and tools.",
      },
    ],
  },
  {
    label: "Library",
    items: [
      {
        title: "Media",
        href: "/admin/media",
        icon: ImageIcon,
        description: "Every uploaded file and where it is used.",
      },
    ],
  },
]

export const ADMIN_SETTINGS_ITEM: AdminNavItem = {
  title: "Settings",
  href: "/admin/settings",
  icon: SettingsIcon,
  description: "Site details and home page sections.",
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  ...ADMIN_NAV.flatMap((group) => group.items),
  ADMIN_SETTINGS_ITEM,
]

export function findAdminNavItem(pathname: string) {
  // Longest match first so nested routes resolve to their own section.
  return [...ADMIN_NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
}
