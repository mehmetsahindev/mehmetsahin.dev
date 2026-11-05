import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
  LOCALE_TAGS,
} from "@/i18n/config"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { META_THEME_COLORS, SITE_URL } from "@/config/site"
import { fontVariables } from "@/lib/fonts"
import { Providers } from "@/components/providers"
import { getProfile, getXHandle } from "@/features/portfolio/data/queries"

// Content comes from the database (cached and revalidated on save), which is
// not reachable while building the Docker image.
export const dynamic = "force-dynamic"

// Thanks @shadcn-ui, @tailwindcss
const darkModeScript = String.raw`
  try {
    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
    }
  } catch (_) {}

  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`

export async function generateMetadata(): Promise<Metadata> {
  const [profile, xHandle] = await Promise.all([getProfile(), getXHandle()])
  const ogImage =
    profile.ogImageUrl ??
    `/og/simple?title=${encodeURIComponent(profile.displayName)}&description=${encodeURIComponent(profile.bio)}`

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s – ${profile.displayName}`,
      default: [profile.displayName, profile.jobTitle]
        .filter(Boolean)
        .join(" – "),
    },
    description: profile.bio,
    keywords: profile.keywords,
    authors: [{ name: profile.displayName, url: SITE_URL }],
    creator: profile.displayName,
    openGraph: {
      siteName: profile.displayName,
      url: "/",
      type: "profile",
      locale: "en_US",
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.username,
      images: [
        { url: ogImage, width: 1200, height: 630, alt: profile.displayName },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: xHandle,
      creator: xHandle,
      images: [ogImage],
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const requested = (await headers()).get(LOCALE_HEADER) ?? ""
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: darkModeScript }}
        />
        {/*
          Thanks @tailwindcss. We inject the script via the `<Script/>` tag again,
          since we found the regular `<script>` tag to not execute when rendering a not-found page.
         */}
        <Script src={`data:text/javascript;base64,${btoa(darkModeScript)}`} />
      </head>

      <body>
        <Providers>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Providers>
      </body>
    </html>
  )
}
