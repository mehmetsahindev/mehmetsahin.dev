import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/icons"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export function NavItemGitHub() {
  return (
    <Button
      className="border-none"
      variant="ghost"
      size="icon-sm"
      nativeButton={false}
      render={
        <a href={SOCIAL.github.href} target="_blank" rel="noopener">
          <GitHubIcon />
          <span className="sr-only">GitHub</span>
        </a>
      }
    />
  )
}
