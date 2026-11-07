import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { isLocale, LOCALE_TAGS } from "@/i18n/config"
import { getMessages } from "@/i18n/messages"
import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { BlogPosting, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { SITE_URL } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Prose } from "@/components/ui/typography"
import { MDX } from "@/components/mdx"
import { TOCInline } from "@/components/toc-inline"
import { TOCMinimap } from "@/components/toc-minimap"
import { PostLanguageSwitcher } from "@/features/blog/components/post-language-switcher"
import {
  getPostNeighbours,
  getPublishedPost,
} from "@/features/blog/data/queries"
import {
  languageAlternates,
  ogImageUrl,
  openGraphBase,
  twitterCard,
} from "@/features/blog/lib/metadata"
import { blogPath, postPath } from "@/features/blog/lib/paths"
import type { PostDetail, PostSummary } from "@/features/blog/types"
import { DocKeyboardShortcuts } from "@/features/doc/components/doc-keyboard-shortcuts"
import {
  DocContainer,
  DocContentCol,
  DocGrid,
  DocLeftCol,
  DocRightCol,
} from "@/features/doc/components/doc-layout"
import { DocPageRoot } from "@/features/doc/components/doc-page-root"
import { DocShareMenu } from "@/features/doc/components/doc-share-menu"

type Props = { params: Promise<{ locale: string; slug: string }> }

async function loadPost(params: Props["params"]) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const post = await getPublishedPost(locale, decodeURIComponent(slug))
  if (!post) notFound()

  return post
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await loadPost(params)
  const path = postPath(post.locale, post.slug)
  const otherLocales = post.translations
    .map((item) => item.locale)
    .filter((locale) => locale !== post.locale)

  // Real cover size when known; generated images are always 1200x630.
  const image = post.coverUrl
    ? {
        url: post.coverUrl,
        width: post.coverWidth ?? undefined,
        height: post.coverHeight ?? undefined,
        alt: post.title,
      }
    : {
        url: ogImageUrl(post.title, post.summary),
        width: 1200,
        height: 630,
        alt: post.title,
      }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: path,
      languages: languageAlternates(
        Object.fromEntries(
          post.translations.map((item) => [
            item.locale,
            postPath(item.locale, item.slug),
          ])
        )
      ),
      types: { "application/rss+xml": `${blogPath(post.locale)}/rss` },
    },
    openGraph: {
      ...(await openGraphBase(post.locale, otherLocales)),
      url: path,
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: post.updatedAt,
      authors: [SITE_URL],
      images: image,
    },
    twitter: await twitterCard(image.url),
  }
}

function getPageJsonLd(post: PostDetail): WithContext<BlogPosting> {
  const url = absoluteUrl(postPath(post.locale, post.slug))

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: post.title,
    description: post.summary,
    inLanguage: LOCALE_TAGS[post.locale],
    image: absoluteUrl(post.coverUrl ?? ogImageUrl(post.title, post.summary)),
    url,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: post.updatedAt,
    author: { "@id": JSON_LD_ID.person },
    publisher: { "@id": JSON_LD_ID.person },
    mainEntityOfPage: url,
    isPartOf: {
      "@type": "Blog",
      "@id": absoluteUrl(blogPath(post.locale)),
      name: "Blog",
      url: absoluteUrl(blogPath(post.locale)),
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await loadPost(params)
  const t = getMessages(post.locale).blog
  const toc = getTableOfContents(post.content)
  const { previous, next } = await getPostNeighbours(post.locale, post.slug)
  const path = postPath(post.locale, post.slug)

  return (
    <div lang={LOCALE_TAGS[post.locale]}>
      <JsonLdScript data={getPageJsonLd(post)} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: t.home, href: "/" },
          { name: t.title, href: blogPath(post.locale) },
          { name: post.title, href: path },
        ])}
      />

      <DocKeyboardShortcuts
        previous={previous ? postPath(previous.locale, previous.slug) : null}
        next={next ? postPath(next.locale, next.slug) : null}
      />

      <DocPageRoot>
        <DocContainer>
          <div className="screen-line-bottom h-px" />

          <div className="flex items-center justify-between gap-2 p-2 pl-4">
            <Button
              className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
              variant="link"
              size="sm"
              nativeButton={false}
              render={
                <Link href={blogPath(post.locale)}>
                  <ArrowLeftIcon />
                  {t.title}
                </Link>
              }
            />

            <div className="flex items-center gap-2">
              <PostLanguageSwitcher
                locale={post.locale}
                translations={post.translations}
                label={t.readIn}
              />
              <DocShareMenu title={post.title} url={path} />
              <NeighbourButton
                post={previous}
                label={t.previous}
                direction="previous"
              />
              <NeighbourButton post={next} label={t.next} direction="next" />
            </div>
          </div>

          <div className="screen-line-top screen-line-bottom py-px">
            <div className="h-4" />
          </div>

          <h1
            data-slot="doc-title"
            className="screen-line-bottom px-4 text-4xl font-medium tracking-tight text-balance"
          >
            {post.title}
          </h1>
        </DocContainer>

        <DocGrid>
          <DocLeftCol />

          <DocContentCol>
            <Prose className="px-(--page-padding) pt-8 [--page-padding:--spacing(4)]">
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}

              <TOCInline className="lg:hidden" items={toc} />

              <div>
                <MDX code={post.content} />
              </div>
            </Prose>

            <div className="screen-line-top h-4" />
          </DocContentCol>

          <DocRightCol>
            <div className="sticky top-[calc(var(--doc-cols-top,0)+(--spacing(3)))] translate-x-2 opacity-0 in-data-doc-cols-ready:opacity-100">
              <TOCMinimap items={toc} />
            </div>
          </DocRightCol>
        </DocGrid>
      </DocPageRoot>
    </div>
  )
}

function NeighbourButton({
  post,
  label,
  direction,
}: {
  post: PostSummary | null
  label: string
  direction: "previous" | "next"
}) {
  if (!post) return null
  const Icon = direction === "previous" ? ArrowLeftIcon : ArrowRightIcon

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="size-7 border-none"
            variant="secondary"
            size="icon-sm"
            nativeButton={false}
            render={
              <Link href={postPath(post.locale, post.slug)} aria-label={label}>
                <Icon />
              </Link>
            }
          />
        }
      />
      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          {label}
          <Kbd>
            <Icon />
          </Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
