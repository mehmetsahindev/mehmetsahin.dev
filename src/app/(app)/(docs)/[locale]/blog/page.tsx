import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { X_USERNAME } from "@/config/site"
import { PostList } from "@/features/blog/components/post-list"
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { getDocsByLocale, getLocales } from "@/features/doc/data/documents"

export const dynamicParams = false

export function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = (await params).locale

  return {
    title: `Blog (${locale.toUpperCase()})`,
    alternates: {
      canonical: `/${locale}/blog`,
    },
    openGraph: {
      url: `/${locale}/blog`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: X_USERNAME,
      creator: X_USERNAME,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = (await params).locale
  const posts = getDocsByLocale(locale)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-svh">
      <div className="screen-line-bottom px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          Blog ({locale.toUpperCase()})
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          A collection of articles on development, design, and ideas.
        </p>
      </div>

      <div className="screen-line-top screen-line-bottom p-2">
        <Suspense
          fallback={
            <div className="flex h-9 w-full rounded-lg border border-input dark:bg-input/30" />
          }
        >
          <PostSearchInput />
        </Suspense>
      </div>

      <Suspense fallback={<PostList posts={posts} />}>
        <PostListWithSearch posts={posts} />
      </Suspense>

      <div className="h-4" />
    </div>
  )
}
