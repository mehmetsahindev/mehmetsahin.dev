import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/** A titled group of fields: description on the left, fields on the right. */
export function FormSection({
  title,
  description,
  className,
  children,
}: {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "grid gap-x-8 gap-y-4 border-b border-line py-8 first:pt-2 last:border-b-0 md:grid-cols-[14rem_1fr]",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium">{title}</h2>
        {description && (
          <p className="text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </section>
  )
}

/** Save bar pinned to the bottom of long forms. */
export function FormActions({
  isPending,
  isDirty,
  submitLabel = "Save changes",
  children,
}: {
  isPending: boolean
  isDirty: boolean
  submitLabel?: string
  /** Extra actions on the left, e.g. delete. */
  children?: React.ReactNode
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex items-center gap-2 border-t border-line bg-background/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      <div className="mr-auto flex items-center gap-2">{children}</div>
      {isDirty && !isPending && (
        <span className="hidden text-sm text-muted-foreground sm:inline">
          Unsaved changes
        </span>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending && <Spinner />}
        {submitLabel}
      </Button>
    </div>
  )
}
