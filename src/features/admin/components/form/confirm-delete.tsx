"use client"

import { useState, useTransition } from "react"
import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/** Delete button with a confirmation step. */
export function ConfirmDelete({
  title,
  description,
  onConfirm,
  label = "Delete",
  iconOnly = false,
}: {
  title: string
  description: string
  /** Return false to keep the dialog open (e.g. on error). */
  onConfirm: () => Promise<boolean | void>
  label?: string
  iconOnly?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant={iconOnly ? "ghost" : "destructive"}
            size={iconOnly ? "icon-sm" : "default"}
            aria-label={iconOnly ? label : undefined}
            className={
              iconOnly
                ? "text-muted-foreground hover:text-destructive"
                : undefined
            }
          />
        }
      >
        <Trash2Icon />
        {!iconOnly && label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const result = await onConfirm()
                if (result !== false) setOpen(false)
              })
            }
          >
            {isPending && <Spinner />}
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
