import "server-only"

import { getDb, schema } from "@/db"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { env } from "@/lib/env"

function createAuth() {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    user: {
      // Single-admin site: only the configured GitHub account may sign up or
      // sign in. Runs on every OAuth sign-in with the fresh provider profile.
      validateUserInfo: ({ source }) => {
        const login = source.oauth?.profile?.login
        const allowed = env.ADMIN_GITHUB_USERNAME.toLowerCase()

        if (typeof login !== "string" || login.toLowerCase() !== allowed) {
          return {
            error: "not_allowed",
            errorDescription: "This account is not allowed to sign in.",
          }
        }
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    plugins: [nextCookies()],
  })
}

type Auth = ReturnType<typeof createAuth>

const globalForAuth = globalThis as unknown as { auth?: Auth }

// Created on first use so builds without auth env vars still succeed.
export function getAuth(): Auth {
  globalForAuth.auth ??= createAuth()
  return globalForAuth.auth
}
