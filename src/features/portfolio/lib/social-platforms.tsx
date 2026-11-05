import { GlobeIcon, MailIcon } from "lucide-react"
import {
  siBehance,
  siBluesky,
  siDevdotto,
  siDiscord,
  siDribbble,
  siGithub,
  siInstagram,
  siMastodon,
  siMedium,
  siStackoverflow,
  siTelegram,
  siThreads,
  siX,
  siYoutube,
  type SimpleIcon,
} from "simple-icons"

import { LinkedInIcon } from "@/components/icons"

function fromSimpleIcon(icon: SimpleIcon) {
  return function PlatformIcon(props: React.ComponentProps<"svg">) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
        <path d={icon.path} />
      </svg>
    )
  }
}

type Platform = {
  label: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
  placeholder: string
}

/** Platforms a social link can point to. Keys are stored in the database. */
export const SOCIAL_PLATFORMS = {
  github: {
    label: "GitHub",
    icon: fromSimpleIcon(siGithub),
    placeholder: "https://github.com/username",
  },
  x: {
    label: "X",
    icon: fromSimpleIcon(siX),
    placeholder: "https://x.com/username",
  },
  linkedin: {
    label: "LinkedIn",
    icon: LinkedInIcon,
    placeholder: "https://linkedin.com/in/username",
  },
  youtube: {
    label: "YouTube",
    icon: fromSimpleIcon(siYoutube),
    placeholder: "https://youtube.com/@username",
  },
  instagram: {
    label: "Instagram",
    icon: fromSimpleIcon(siInstagram),
    placeholder: "https://instagram.com/username",
  },
  bluesky: {
    label: "Bluesky",
    icon: fromSimpleIcon(siBluesky),
    placeholder: "https://bsky.app/profile/username",
  },
  threads: {
    label: "Threads",
    icon: fromSimpleIcon(siThreads),
    placeholder: "https://threads.net/@username",
  },
  mastodon: {
    label: "Mastodon",
    icon: fromSimpleIcon(siMastodon),
    placeholder: "https://mastodon.social/@username",
  },
  medium: {
    label: "Medium",
    icon: fromSimpleIcon(siMedium),
    placeholder: "https://medium.com/@username",
  },
  devto: {
    label: "DEV",
    icon: fromSimpleIcon(siDevdotto),
    placeholder: "https://dev.to/username",
  },
  stackoverflow: {
    label: "Stack Overflow",
    icon: fromSimpleIcon(siStackoverflow),
    placeholder: "https://stackoverflow.com/users/123/username",
  },
  dribbble: {
    label: "Dribbble",
    icon: fromSimpleIcon(siDribbble),
    placeholder: "https://dribbble.com/username",
  },
  behance: {
    label: "Behance",
    icon: fromSimpleIcon(siBehance),
    placeholder: "https://behance.net/username",
  },
  discord: {
    label: "Discord",
    icon: fromSimpleIcon(siDiscord),
    placeholder: "https://discord.com/users/123",
  },
  telegram: {
    label: "Telegram",
    icon: fromSimpleIcon(siTelegram),
    placeholder: "https://t.me/username",
  },
  email: {
    label: "Email",
    icon: MailIcon,
    placeholder: "mailto:you@example.com",
  },
  website: {
    label: "Website",
    icon: GlobeIcon,
    placeholder: "https://example.com",
  },
} satisfies Record<string, Platform>

export type SocialPlatformKey = keyof typeof SOCIAL_PLATFORMS

export function getSocialPlatform(key: string): Platform {
  return SOCIAL_PLATFORMS[key as SocialPlatformKey] ?? SOCIAL_PLATFORMS.website
}
