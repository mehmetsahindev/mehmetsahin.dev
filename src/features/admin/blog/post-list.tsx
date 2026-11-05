"use client"

import { useMemo, useState } from "react"
import type { Route } from "next"
import Link from "next/link"
import { LOCALE_LABELS, LOCALES } from "@/i18n/config"
import { format } from "date-fns"
import {
  ChevronRightIcon,
  FileTextIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { AdminPageHeader } from "../components/admin-page"
import { ListEmpty } from "../components/list-empty"
import { StatusBadge } from "./post-editor"
import type { PostListItem } from "./queries"

type Filter = "all" | "published" | "draft"

export function PostList({ posts }: { posts: PostListItem[] }) {
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (
        filter !== "all" &&
        !post.translations.some((item) => item.status === filter)
      ) {
        return false
      }
      return (
        !q ||
        post.translations.some((item) => item.title.toLowerCase().includes(q))
      )
    })
  }, [posts, filter, query])

  const newButton = (
    <Button nativeButton={false} render={<Link href="/admin/blog/new" />}>
      <PlusIcon />
      New post
    </Button>
  )

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Posts and their translations."
        actions={posts.length > 0 ? newButton : undefined}
      />

      {posts.length === 0 ? (
        <ListEmpty
          icon={<FileTextIcon />}
          title="No posts yet"
          description="Write your first post. You can add translations at any time."
          action={newButton}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[filter]}
              onValueChange={(next) => next[0] && setFilter(next[0] as Filter)}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="published">Published</ToggleGroupItem>
              <ToggleGroupItem value="draft">Drafts</ToggleGroupItem>
            </ToggleGroup>
            <InputGroup className="h-8 w-full sm:ml-auto sm:w-56">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder="Search titles"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </InputGroup>
          </div>

          <ul className="flex flex-col overflow-hidden rounded-xl border border-line">
            {visible.map((post) => {
              const main = post.translations[0]
              return (
                <li
                  key={post.id}
                  className="border-b border-line last:border-b-0"
                >
                  <Link
                    href={`/admin/blog/${post.id}` as Route}
                    className="group flex items-center gap-4 px-4 py-3 hover:bg-accent/40"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex items-center gap-2 truncate text-sm font-medium">
                        {post.pinned && (
                          <PinIcon
                            className="size-3.5 shrink-0 text-muted-foreground"
                            aria-label="Pinned"
                          />
                        )}
                        <span className="truncate">
                          {main?.title || "Untitled"}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {format(new Date(post.publishedAt), "d MMM yyyy")} ·
                        edited {format(new Date(post.updatedAt), "d MMM")}
                      </span>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                      {LOCALES.map((locale) => {
                        const translation = post.translations.find(
                          (item) => item.locale === locale
                        )
                        return translation ? (
                          <span
                            key={locale}
                            className="flex items-center gap-1.5"
                          >
                            <span className="font-mono text-xs text-muted-foreground uppercase">
                              {locale}
                            </span>
                            <StatusBadge status={translation.status} />
                          </span>
                        ) : (
                          <span
                            key={locale}
                            className="font-mono text-xs text-muted-foreground/50 uppercase line-through"
                            title={`No ${LOCALE_LABELS[locale]} translation`}
                          >
                            {locale}
                          </span>
                        )
                      })}
                    </div>

                    <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              )
            })}
            {visible.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                No posts match.
              </li>
            )}
          </ul>
        </>
      )}
    </>
  )
}
