import type { Route } from "next"

import type { NavItem } from "@/types/nav"

/** Public origin of the site, without a trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://mehmetsahin.dev"
).replace(/\/$/, "")

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const UTM_PARAMS = {
  utm_source: new URL(SITE_URL).hostname,
}
