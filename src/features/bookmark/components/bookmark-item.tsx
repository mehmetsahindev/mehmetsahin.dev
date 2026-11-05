import { format } from "date-fns"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/ui/icon-tile"
import { Separator } from "@/components/ui/separator"
import { NewsIcon } from "@/components/icons"
import {
  hasIcon,
  PortfolioIcon,
} from "@/features/portfolio/components/portfolio-icon"
import type { BookmarkData } from "@/features/portfolio/data/types"

import type { BookmarkClickSurface } from "../lib/analytics"
import { BookmarkExternalLink } from "./bookmark-external-link"

export function BookmarkItem({
  className,
  bookmark,
  surface,
}: {
  className?: string
  bookmark: BookmarkData
  surface: BookmarkClickSurface
}) {
  const hasWhy = Boolean(bookmark.note)

  return (
    <div
      className={cn(
        "relative flex pr-2 hover:bg-accent-muted",
        hasWhy ? "items-start" : "items-center",
        className
      )}
    >
      <IconTile className={cn("mx-4", hasWhy && "mt-3.75")}>
        {hasIcon(bookmark.icon) ? (
          <PortfolioIcon icon={bookmark.icon} />
        ) : (
          <NewsIcon />
        )}
      </IconTile>

      <div className="flex-1 space-y-1 border-l border-dashed border-line p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance">
          <BookmarkExternalLink url={bookmark.url} surface={surface}>
            <span className="absolute inset-0" aria-hidden />
            {bookmark.title}
          </BookmarkExternalLink>
        </h3>

        <dl className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {bookmark.author && (
            <>
              <div>
                <dt className="sr-only">Author</dt>
                <dd>{bookmark.author}</dd>
              </div>

              <MetaSeparator />
            </>
          )}

          <div>
            <dt className="sr-only">Category</dt>
            <dd>{bookmark.category.name}</dd>
          </div>

          <MetaSeparator />

          <div>
            <dt className="sr-only">Bookmarked on</dt>
            <dd>
              <time dateTime={new Date(bookmark.bookmarkedAt).toISOString()}>
                {format(new Date(bookmark.bookmarkedAt), "d MMM yyyy")}
              </time>
            </dd>
          </div>
        </dl>

        {bookmark.note && (
          <p className="mt-4 border-t border-dashed border-line pt-4 text-sm text-pretty text-foreground">
            {bookmark.note}
          </p>
        )}
      </div>

      <ArrowUpRightIcon
        className={cn(
          "size-4 shrink-0 text-muted-foreground",
          hasWhy && "mt-4.75"
        )}
      />
    </div>
  )
}

function MetaSeparator() {
  return (
    <Separator
      className="data-vertical:h-4 data-vertical:self-center"
      orientation="vertical"
      aria-hidden
    />
  )
}
