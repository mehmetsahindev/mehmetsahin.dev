import { z } from "zod"

import { SOCIAL_PLATFORMS } from "@/features/portfolio/lib/social-platforms"

const platformKeys = Object.keys(SOCIAL_PLATFORMS) as [
  keyof typeof SOCIAL_PLATFORMS,
  ...(keyof typeof SOCIAL_PLATFORMS)[],
]

export const socialLinkSchema = z
  .object({
    platform: z.enum(platformKeys),
    url: z.string().trim().min(1, "URL is required."),
    handle: z.string().trim().max(80),
    sameAs: z.boolean(),
  })
  .refine(
    (value) =>
      value.platform === "email"
        ? /^mailto:[^\s@]+@[^\s@]+$/.test(value.url)
        : /^https?:\/\/\S+$/.test(value.url),
    {
      path: ["url"],
      message: "Enter a full URL (https://…), or mailto:… for email.",
    }
  )

export type SocialLinkInput = z.infer<typeof socialLinkSchema>
