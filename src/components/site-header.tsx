import Link from "next/link"

import { MAIN_NAV } from "@/config/site"
import { Separator } from "@/components/ui/separator"
import { NavDesktop } from "@/components/nav-desktop"
import { SiteMark } from "@/components/site-mark"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-(--header-height) max-w-screen overflow-x-clip bg-background px-2 pt-1">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-full items-center gap-2 border-x border-x-line pr-2 pl-4 group-has-data-[slot=layout-wide]/layout:container after:z-1 sm:gap-4 md:max-w-3xl">
        <Link href="/" aria-label="Home">
          <SiteMark className="h-6 shrink-0" />
        </Link>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center">
          <Separator
            orientation="vertical"
            className="mr-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <ThemeToggle />
        </div>

        {/* <div className="absolute top-[-3.5px] left-[-4.5px] z-2 flex size-2 border border-line bg-background" /> */}
        {/* <div className="absolute top-[-3.5px] right-[-4.5px] z-2 flex size-2 border border-line bg-background" /> */}
      </div>
    </header>
  )
}
