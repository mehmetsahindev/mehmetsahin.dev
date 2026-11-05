"use client"

import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

/**
 * Start and end month ("YYYY-MM"). Ticking "Current" clears the end month,
 * which the site shows as "Present".
 */
export function PeriodFields({
  start,
  end,
  onStartChange,
  onEndChange,
  currentLabel = "I currently work here",
  startError,
  endError,
}: {
  start: string
  end: string | null
  onStartChange: (value: string) => void
  onEndChange: (value: string | null) => void
  currentLabel?: string
  startError?: string
  endError?: string
}) {
  const id = useId()
  const isCurrent = end === null

  return (
    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
      <Field data-invalid={Boolean(startError) || undefined}>
        <FieldLabel htmlFor={`${id}-start`}>Start</FieldLabel>
        <Input
          id={`${id}-start`}
          type="month"
          value={start}
          onChange={(event) => onStartChange(event.target.value)}
          aria-invalid={Boolean(startError) || undefined}
        />
        <FieldError>{startError}</FieldError>
      </Field>

      <Field data-invalid={Boolean(endError) || undefined}>
        <FieldLabel htmlFor={`${id}-end`}>End</FieldLabel>
        <Input
          id={`${id}-end`}
          type="month"
          value={end ?? ""}
          disabled={isCurrent}
          onChange={(event) => onEndChange(event.target.value)}
          aria-invalid={Boolean(endError) || undefined}
        />
        <FieldError>{endError}</FieldError>
      </Field>

      <Field orientation="horizontal" className="sm:col-span-2">
        <Checkbox
          id={`${id}-current`}
          checked={isCurrent}
          onCheckedChange={(checked) => onEndChange(checked ? null : "")}
        />
        <FieldLabel htmlFor={`${id}-current`} className="font-normal">
          {currentLabel}
        </FieldLabel>
      </Field>
    </div>
  )
}
