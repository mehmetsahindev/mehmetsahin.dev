import "server-only"

import { z } from "zod"

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  GITHUB_CLIENT_ID: z.string().default(""),
  GITHUB_CLIENT_SECRET: z.string().default(""),
  /** The only GitHub account allowed into the admin panel. */
  ADMIN_GITHUB_USERNAME: z.string().min(1),
  /** Directory where uploaded media files are stored. */
  UPLOADS_DIR: z.string().default("./uploads"),
})

type ServerEnv = z.infer<typeof serverEnvSchema>

let cached: ServerEnv | undefined

// Parsed lazily so `next build` can prerender public pages without secrets.
export const env = new Proxy({} as ServerEnv, {
  get(_, key: string) {
    cached ??= serverEnvSchema.parse(process.env)
    return cached[key as keyof ServerEnv]
  },
})
