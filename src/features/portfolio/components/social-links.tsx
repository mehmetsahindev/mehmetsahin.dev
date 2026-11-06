import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Panel, PanelContent } from "@/features/portfolio/components/panel"
import { getSocialLinks } from "@/features/portfolio/data/queries"
import { getSocialPlatform } from "@/features/portfolio/lib/social-platforms"

export async function SocialLinks() {
  const links = await getSocialLinks()

  if (links.length === 0) return null

  return (
    <Panel className="screen-line-top-none">
      <h2 className="sr-only">Social links</h2>

      <PanelContent>
        <ul className="flex flex-wrap gap-2">
          {links.map((item) => {
            const platform = getSocialPlatform(item.platform)
            const Icon = platform.icon

            return (
              <li key={item.id}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        className="text-foreground/80 shadow-none [&_svg:not([class*='size-'])]:size-4.5"
                        variant="outline"
                        size="icon-sm"
                        nativeButton={false}
                        render={
                          <a
                            href={
                              item.url.startsWith("http")
                                ? addQueryParams(item.url, UTM_PARAMS)
                                : item.url
                            }
                            target="_blank"
                            rel="noopener"
                          >
                            <Icon />
                            <span className="sr-only">{platform.label}</span>
                          </a>
                        }
                      />
                    }
                  />
                  <TooltipContent>
                    {platform.label}
                    {item.handle && ` (${item.handle})`}
                  </TooltipContent>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </PanelContent>
    </Panel>
  )
}
