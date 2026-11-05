import { SITE_URL } from "@/config/site"
import { markdownResponse } from "@/lib/markdown-response"
import {
  getProfile,
  getSocialLinks,
  getTechStack,
} from "@/features/portfolio/data/queries"
import { getSocialPlatform } from "@/features/portfolio/lib/social-platforms"

export const dynamic = "force-dynamic"

export async function GET() {
  const [profile, socialLinks, techStack] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getTechStack(),
  ])

  const techItems = techStack.flatMap((category) => category.items)

  return markdownResponse(`# About

${profile.about.trim()}

## Personal Information

- First Name: ${profile.firstName}
- Last Name: ${profile.lastName}
- Display Name: ${profile.displayName}
- Location: ${profile.location}
- Website: ${SITE_URL}

## Social Links

${socialLinks.map((item) => `- [${getSocialPlatform(item.platform).label}](${item.url})`).join("\n")}

## Tech Stack

${techItems.map((item) => (item.url ? `- [${item.name}](${item.url})` : `- ${item.name}`)).join("\n")}
`)
}
