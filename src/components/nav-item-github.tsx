import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/icons"
import { getSocialLinks } from "@/features/portfolio/data/queries"

export async function NavItemGitHub() {
  const github = (await getSocialLinks()).find(
    (link) => link.platform === "github"
  )

  if (!github) return null

  return (
    <Button
      className="border-none"
      variant="ghost"
      size="icon-sm"
      nativeButton={false}
      render={
        <a href={github.url} target="_blank" rel="noopener">
          <GitHubIcon />
          <span className="sr-only">GitHub</span>
        </a>
      }
    />
  )
}
