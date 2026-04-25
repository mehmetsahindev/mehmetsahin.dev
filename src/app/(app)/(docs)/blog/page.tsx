import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { X_USERNAME } from "@/config/site"
import { PostList } from "@/features/blog/components/post-list"
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { getDocsByLocale, getLocales } from "@/features/doc/data/documents"

const title = "Blog"
const description =
  "A collection of articles on development, design, and ideas."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    url: "/blog",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_USERNAME,
    creator: X_USERNAME,
    images: [ogImage],
  },
}

export default async function Page() {
  const supportedLocales = getLocales()

  // 1. Çerez kontrolü
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get("NEXT_LOCALE")
  if (localeCookie && supportedLocales.includes(localeCookie.value)) {
    redirect(`/${localeCookie.value}/blog`)
  }

  // 2. Accept-Language (Tarayıcı Dili) kontrolü
  const headersList = await headers()
  const acceptLanguage = headersList.get("accept-language")
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase())

    for (const preferred of preferredLocales) {
      if (supportedLocales.includes(preferred)) {
        redirect(`/${preferred}/blog`)
      }
    }
  }

  const allPosts = getDocsByLocale(undefined)

  return (
    <div className="min-h-svh">
      <div className="screen-line-bottom px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          {title}
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {description}
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

      <Suspense fallback={<PostList posts={allPosts} />}>
        <PostListWithSearch posts={allPosts} />
      </Suspense>

      <div className="h-4" />
    </div>
  )
}
