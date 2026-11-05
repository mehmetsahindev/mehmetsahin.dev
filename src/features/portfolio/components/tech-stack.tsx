import { slugify } from "@/utils/slugify"

import { getTechStack } from "../data/queries"
import { Panel, PanelHeader, PanelTitle } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"
import { PortfolioIcon } from "./portfolio-icon"

const ID = "stack"

export async function TechStack() {
  const categories = (await getTechStack()).filter(
    (category) => category.items.length > 0
  )

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Stack</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="relative [--badge-height:--spacing(6)] [--col-left-width:--spacing(48)]">
        <div
          className="pointer-events-none absolute inset-y-0 left-(--col-left-width) -z-1 w-px border-r border-dashed border-line max-sm:hidden"
          aria-hidden
        />

        {categories.map(({ id, name: category, items }, index) => {
          const categoryId = `${ID}-${slugify(category) || id}`

          return (
            <div
              key={category}
              className="grid items-start gap-y-2 border-b border-line py-4 last:border-none sm:grid-cols-[var(--col-left-width)_1fr]"
            >
              <div id={categoryId} className="pl-4 text-sm/(--badge-height)">
                <span
                  className="mr-1.5 font-mono text-muted-foreground/80 select-none"
                  aria-hidden
                >
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                {category}
              </div>

              <ul
                aria-labelledby={categoryId}
                className="flex flex-wrap gap-1.5 px-4"
              >
                {items.map((item) => {
                  return (
                    <li key={item.id} className="flex">
                      <a
                        href={item.url || undefined}
                        target="_blank"
                        rel="noopener"
                        className="flex h-(--badge-height) items-center justify-center gap-1.25 rounded-full bg-zinc-50/80 px-2 font-mono text-xs text-foreground inset-ring-1 inset-ring-border dark:bg-zinc-900/80 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground/80"
                      >
                        <PortfolioIcon icon={item.icon} />
                        {item.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
