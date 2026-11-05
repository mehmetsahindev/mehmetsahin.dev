import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { env } from "@/lib/env"
import { SiteMark } from "@/components/site-mark"
import { SignInWithGitHub } from "@/features/admin/components/sign-in-with-github"
import { getAdminSession } from "@/features/admin/lib/session"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
}

const ERROR_MESSAGES: Record<string, string> = {
  not_allowed: "This GitHub account is not allowed to access the admin panel.",
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await getAdminSession()) {
    redirect("/admin")
  }

  const { error } = await searchParams
  const isConfigured = Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)

  return (
    <div className="grid min-h-svh place-items-center px-2">
      <div className="w-full max-w-sm border-x border-line">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-8" />
        </div>

        <div className="flex flex-col items-center gap-6 px-6 py-10">
          <Link href="/" aria-label="Home">
            <SiteMark className="h-8" />
          </Link>

          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="font-heading text-2xl font-medium tracking-tight">
              Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage your site.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="w-full rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-sm text-destructive"
            >
              {ERROR_MESSAGES[error] ?? "Sign in failed. Please try again."}
            </p>
          )}

          <SignInWithGitHub disabled={!isConfigured} />

          {!isConfigured && (
            <p className="text-center font-mono text-xs text-muted-foreground">
              Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable sign in.
            </p>
          )}
        </div>

        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-8" />
        </div>
      </div>
    </div>
  )
}
