import { cn } from "@/lib/utils"

export function AdminPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-page"
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8",
        className
      )}
      {...props}
    />
  )
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-medium tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
