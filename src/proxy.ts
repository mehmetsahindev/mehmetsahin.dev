import { NextResponse, type NextRequest } from "next/server"
import { DEFAULT_LOCALE, LOCALE_HEADER, LOCALES } from "@/i18n/config"
import { getSessionCookie } from "better-auth/cookies"

const PREFIXED_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return guardAdmin(request)
  }

  return routeBlog(request)
}

// Optimistic check only: real authorization happens in `requireAdmin`.
function guardAdmin(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  return NextResponse.next()
}

/**
 * Blog URLs: `/blog/...` is the default locale and `/tr/blog/...` the others.
 * Pages live under `app/.../[locale]/blog`, so unprefixed paths are rewritten
 * to the default locale and its prefixed form redirects to the clean URL.
 */
function routeBlog(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const defaultPrefix = `/${DEFAULT_LOCALE}/blog`
  if (pathname === defaultPrefix || pathname.startsWith(`${defaultPrefix}/`)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1)
    return NextResponse.redirect(url, 308)
  }

  const prefixed = PREFIXED_LOCALES.find(
    (locale) =>
      pathname === `/${locale}/blog` || pathname.startsWith(`/${locale}/blog/`)
  )
  const locale = prefixed ?? DEFAULT_LOCALE
  const rest = prefixed ? pathname.slice(prefixed.length + 1) : pathname

  if (rest !== "/blog" && !rest.startsWith("/blog/")) {
    return NextResponse.next()
  }

  const headers = new Headers(request.headers)
  headers.set(LOCALE_HEADER, locale)

  const rewrite = (target: string) =>
    NextResponse.rewrite(new URL(target, request.url), {
      request: { headers },
    })

  // Feeds and Markdown versions are shared route handlers that read the
  // locale header.
  if (rest === "/blog/rss") {
    return rewrite("/blog/rss")
  }

  const slug = rest.startsWith("/blog/") ? rest.slice("/blog/".length) : ""
  const wantsMarkdown = (request.headers.get("accept") ?? "").includes(
    "text/markdown"
  )
  if (slug && !slug.includes("/") && (slug.endsWith(".md") || wantsMarkdown)) {
    return rewrite(`/doc.md/${slug.replace(/\.md$/, "")}`)
  }

  return rewrite(`/${locale}${rest}${search}`)
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/blog",
    "/blog/:path*",
    // Matchers must be static: keep the locale list in sync with LOCALES.
    "/:locale(en|tr)/blog",
    "/:locale(en|tr)/blog/:path*",
  ],
}
