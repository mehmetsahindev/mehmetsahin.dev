import Link from "next/link"
import { DEFAULT_LOCALE } from "@/i18n/config"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PostItem } from "@/features/blog/components/post-item"
import { getPublishedPosts } from "@/features/blog/data/queries"
import { blogPath } from "@/features/blog/lib/paths"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"

const ID = "blog"

export async function Blog() {
  // The home page is in the default language.
  const allPosts = await getPublishedPosts(DEFAULT_LOCALE)

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Blog</a>
          <PanelTitleSup>({allPosts.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line"></div>
          <div className="border-l border-line"></div>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allPosts.slice(0, 4).map((post) => (
            <li
              key={post.id}
              className={cn(
                "max-sm:screen-line-top max-sm:screen-line-bottom",
                "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom"
              )}
            >
              <PostItem post={post} headingAs="h3" imageLoading="lazy" />
            </li>
          ))}
        </ul>
      </div>

      <div className="screen-line-top flex justify-center py-4">
        <Button
          className="gap-2 pr-2.5 pl-3 shadow-[inset_0_0_1px] shadow-foreground/20"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href={blogPath(DEFAULT_LOCALE)} />}
        >
          All posts
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}
