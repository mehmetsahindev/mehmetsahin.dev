import { Suspense } from "react"
import type { Metadata } from "next"
import type { CollectionPage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { twitterCard } from "@/features/blog/lib/metadata"
import { BookmarkFilters } from "@/features/bookmark/components/bookmark-filters"
import { BookmarkItem } from "@/features/bookmark/components/bookmark-item"
import { BookmarkList } from "@/features/bookmark/components/bookmark-list"
import { BookmarkListFiltered } from "@/features/bookmark/components/bookmark-list-filtered"
import type { BookmarkListEntry } from "@/features/bookmark/types"
import {
  getBookmarkCategories,
  getBookmarks,
  getProfile,
} from "@/features/portfolio/data/queries"

const title = "Bookmarks"
const description =
  "Hand-picked articles, courses, books, and references worth your time."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export async function generateMetadata(): Promise<Metadata> {
  const [profile, twitter] = await Promise.all([
    getProfile(),
    twitterCard(ogImage),
  ])

  return {
    title,
    description,
    alternates: {
      canonical: "/bookmarks",
    },
    openGraph: {
      siteName: profile.displayName,
      url: "/bookmarks",
      type: "website",
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter,
  }
}

function getCollectionPageJsonLd(
  items: { url: string }[]
): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/bookmarks"),
    name: title,
    description,
    url: absoluteUrl("/bookmarks"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
      })),
    },
    isPartOf: { "@id": JSON_LD_ID.website },
  }
}

export default async function Page() {
  const [bookmarks, categories] = await Promise.all([
    getBookmarks(),
    getBookmarkCategories(),
  ])

  const entries = bookmarks.map<BookmarkListEntry>((bookmark) => ({
    id: bookmark.id,
    category: bookmark.category.slug,
    card: <BookmarkItem bookmark={bookmark} surface="list" />,
  }))

  // Only offer filters that match something.
  const usedCategories = categories.filter((category) =>
    bookmarks.some((bookmark) => bookmark.category.id === category.id)
  )

  return (
    <>
      <JsonLdScript data={getCollectionPageJsonLd(bookmarks)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Bookmarks",
            href: "/bookmarks",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>Bookmarks</PageHeadingTagline>
          <PageHeadingTitle>Things worth your time.</PageHeadingTitle>
          <PageHeadingDescription>
            Hand-picked articles, courses, books, and references.
          </PageHeadingDescription>
        </PageHeading>

        <div className="h-4" />

        <div className="screen-line-bottom flex h-px" />

        <Suspense fallback={<div className="h-12" />}>
          <BookmarkFilters categories={usedCategories} />
        </Suspense>

        <div className="screen-line-top screen-line-bottom before:z-1">
          <div className="stripe-divider" />
        </div>

        <Suspense fallback={<BookmarkList entries={entries} />}>
          <BookmarkListFiltered entries={entries} />
        </Suspense>

        <div className="h-4" />
      </div>
    </>
  )
}
