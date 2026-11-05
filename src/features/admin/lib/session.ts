import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getAuth } from "@/lib/auth"

export const getAdminSession = cache(async () => {
  // Read request headers first: it marks the route dynamic before any
  // server-only env is touched, so builds never try to prerender admin pages.
  const requestHeaders = await headers()
  return getAuth().api.getSession({ headers: requestHeaders })
})

/**
 * Data-access guard. Call it in every admin page, layout, Server Action and
 * Route Handler: the proxy cookie check is only an optimistic redirect.
 */
export async function requireAdmin() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}
