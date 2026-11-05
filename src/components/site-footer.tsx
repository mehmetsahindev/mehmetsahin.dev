import { cn } from "@/lib/utils"
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

const SOCIAL_ICONS = [
  { profile: SOCIAL.x, icon: XIcon, label: "X Profile" },
  { profile: SOCIAL.github, icon: GitHubIcon, label: "GitHub Profile" },
  { profile: SOCIAL.linkedin, icon: LinkedInIcon, label: "LinkedIn Profile" },
]

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <dl className="flex flex-col gap-4 py-8 font-mono [&_dd]:text-sm [&_dt]:text-right [&_dt]:text-sm [&_dt]:text-muted-foreground">
          <Item>
            <dt>Crafted by</dt>
            <dd>
              <a
                className="link-underline"
                href={SOCIAL.github.href}
                target="_blank"
                rel="noopener"
              >
                {USER.displayName}
              </a>
            </dd>
          </Item>

          <Item>
            <dt>Based on</dt>
            <dd>
              <a
                className="link-underline"
                href="https://github.com/ncdai/chanhdai.com"
                target="_blank"
                rel="noopener"
              >
                chanhdai.com
              </a>
            </dd>
          </Item>

          <Item>
            <dt>Copyright</dt>
            <dd>&copy; {new Date().getFullYear()}</dd>
          </Item>
        </dl>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex items-center justify-center gap-3 border-x border-line bg-background px-4">
            {SOCIAL_ICONS.map(({ profile, icon: Icon, label }, index) => (
              <div key={label} className="flex items-center gap-3">
                {index > 0 && <Separator />}
                <a
                  className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
                  href={profile.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                >
                  <Icon className="size-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-line", className)} {...props} />
}

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-2 gap-4", className)} {...props} />
}
