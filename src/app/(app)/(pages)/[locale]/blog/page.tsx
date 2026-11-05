import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { isLocale, LOCALE_TAGS, LOCALES, type Locale } from "@/i18n/config"
import { getMessages } from "@/i18n/messages"
import type { Blog, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { PostList } from "@/features/blog/components/post-list"
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { getPublishedPosts } from "@/features/blog/data/queries"
import {
  languageAlternates,
  ogImageUrl,
  openGraphBase,
  twitterCard,
} from "@/features/blog/lib/metadata"
import { blogPath, postPath } from "@/features/blog/lib/paths"
import type { PostSummary } from "@/features/blog/types"

type Props = { params: Promise<{ locale: string }> }

async function resolveLocale(params: Props["params"]): Promise<Locale> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return locale
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const t = getMessages(locale).blog
  const path = blogPath(locale)
  const image = ogImageUrl(t.title, t.description)

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(
        Object.fromEntries(LOCALES.map((item) => [item, blogPath(item)]))
      ),
      types: { "application/rss+xml": `${path}/rss` },
    },
    openGraph: {
      ...(await openGraphBase(
        locale,
        LOCALES.filter((item) => item !== locale)
      )),
      url: path,
      type: "website",
      images: { url: image, width: 1200, height: 630, alt: t.title },
    },
    twitter: await twitterCard(image),
  }
}

function getBlogJsonLd(
  locale: Locale,
  posts: PostSummary[]
): WithContext<Blog> {
  const t = getMessages(locale).blog
  const url = absoluteUrl(blogPath(locale))

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": url,
    name: t.title,
    description: t.description,
    inLanguage: LOCALE_TAGS[locale],
    url,
    isPartOf: { "@id": JSON_LD_ID.website },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      url: absoluteUrl(postPath(locale, post.slug)),
      datePublished: post.publishedAt,
    })),
  }
}

export default async function BlogPage({ params }: Props) {
  const locale = await resolveLocale(params)
  const t = getMessages(locale).blog
  const posts = await getPublishedPosts(locale)

  return (
    <div lang={LOCALE_TAGS[locale]}>
      <JsonLdScript data={getBlogJsonLd(locale, posts)} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: t.home, href: "/" },
          { name: t.title, href: blogPath(locale) },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>{t.tagline}</PageHeadingTagline>
          <PageHeadingTitle>{t.description}</PageHeadingTitle>
        </PageHeading>

        <div className="h-4" />

        <div className="screen-line-top screen-line-bottom p-2">
          <Suspense
            fallback={
              <div className="flex h-9 w-full rounded-lg border border-input dark:bg-input/30" />
            }
          >
            <PostSearchInput placeholder={t.searchPlaceholder} />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <PostList
              posts={posts}
              emptyLabel={posts.length ? t.noResults : t.empty}
            />
          }
        >
          <PostListWithSearch
            posts={posts}
            emptyLabel={posts.length ? t.noResults : t.empty}
          />
        </Suspense>

        <div className="h-4" />
      </div>
    </div>
  )
}
