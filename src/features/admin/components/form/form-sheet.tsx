"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"

/** Right-hand sheet holding a create/edit form with a sticky footer. */
export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  isPending,
  submitLabel = "Save",
  footerStart,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isPending: boolean
  submitLabel?: string
  /** Left side of the footer, e.g. a delete button. */
  footerStart?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 data-[side=right]:sm:max-w-lg">
        <form onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
          <SheetHeader className="border-b border-line p-4 pr-12">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
            {children}
          </div>

          <SheetFooter className="flex-row items-center border-t border-line p-4">
            <div className="mr-auto">{footerStart}</div>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              {submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
