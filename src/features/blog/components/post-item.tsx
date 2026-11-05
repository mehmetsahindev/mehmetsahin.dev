import type { ImageProps } from "next/image"
import Image from "next/image"
import Link from "next/link"
import { DATE_LOCALES } from "@/i18n/messages"
import { format } from "date-fns"

import { postPath } from "../lib/paths"
import type { PostSummary } from "../types"

type HeadingTypes = "h2" | "h3" | "h4"

export function PostItem({
  post,
  headingAs,
  imageLoading = "lazy",
  publishedLabel = "Published on",
}: {
  post: PostSummary
  headingAs?: HeadingTypes
  imageLoading?: ImageProps["loading"]
  publishedLabel?: string
}) {
  const Heading = headingAs ?? "h2"

  return (
    <div className="group/post relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted">
      {post.coverUrl && (
        <div className="relative select-none [--image-radius:var(--radius-xl)]">
          <Image
            className="aspect-1200/630 rounded-(--image-radius) object-cover grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/post:grayscale-0"
            src={post.coverUrl}
            alt={post.title}
            width={1200}
            height={630}
            quality={100}
            loading={imageLoading}
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <Heading className="text-lg/snug font-medium text-balance">
          <Link href={postPath(post.locale, post.slug)}>
            <span className="absolute inset-0" aria-hidden />
            {post.title}
          </Link>
        </Heading>

        <dl>
          <dt className="sr-only">{publishedLabel}</dt>
          <dd className="text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), "d MMM yyyy", {
                locale: DATE_LOCALES[post.locale],
              })}
            </time>
          </dd>
        </dl>
      </div>
    </div>
  )
}
