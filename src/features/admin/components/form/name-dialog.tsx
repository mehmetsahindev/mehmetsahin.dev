"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

/** Small dialog that asks for a single name (create or rename). */
export function NameDialog({
  open,
  onOpenChange,
  title,
  label = "Name",
  initialValue = "",
  submitLabel = "Save",
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  label?: string
  initialValue?: string
  submitLabel?: string
  onSubmit: (
    name: string
  ) => Promise<
    | { ok: true }
    | { ok: false; error: string; fieldErrors?: Record<string, string> }
  >
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {open && (
          <NameForm
            title={title}
            label={label}
            initialValue={initialValue}
            submitLabel={submitLabel}
            onSubmit={onSubmit}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function NameForm({
  title,
  label,
  initialValue,
  submitLabel,
  onSubmit,
  onDone,
}: {
  title: string
  label: string
  initialValue: string
  submitLabel: string
  onSubmit: Parameters<typeof NameDialog>[0]["onSubmit"]
  onDone: () => void
}) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        startTransition(async () => {
          const result = await onSubmit(value)
          if (result.ok) {
            toast.add({ type: "success", title: "Saved" })
            onDone()
          } else {
            setError(Object.values(result.fieldErrors ?? {})[0] ?? result.error)
          }
        })
      }}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <Field data-invalid={Boolean(error) || undefined}>
        <FieldLabel htmlFor="name-dialog-input">{label}</FieldLabel>
        <Input
          id="name-dialog-input"
          autoFocus
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(undefined)
          }}
        />
        <FieldError>{error}</FieldError>
      </Field>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
