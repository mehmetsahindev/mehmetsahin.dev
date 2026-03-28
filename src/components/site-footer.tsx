import { cn } from "@/lib/utils"

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="screen-line-top mx-auto border-x border-line py-4 group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <p className="px-4 text-center font-mono text-sm text-balance text-muted-foreground">
          <span>{new Date().getFullYear()}</span>{" "}
          <span>&copy; mehmetsahin.dev</span>
        </p>
      </div>

      {/* <SiteFooterInteractiveLogotype /> */}

      {/* <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-16 sm:h-2" />
      </div> */}
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-line", className)} {...props} />
}
