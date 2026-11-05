"use client"

import { useTransition } from "react"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"

import { toast } from "@/components/ui/toast"

type Result =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

/**
 * Submits validated form values to a Server Action, maps server field
 * errors back onto the form and reports the outcome as a toast.
 */
export function useActionSubmit<T extends FieldValues, R extends Result>(
  form: UseFormReturn<T>,
  action: (values: T) => Promise<R>,
  options: {
    successMessage: string
    onSuccess?: (result: R, values: T) => void
  }
) {
  const [isPending, startTransition] = useTransition()

  const onSubmit = form.handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await action(values)

        if (result.ok) {
          toast.add({ type: "success", title: options.successMessage })
          form.reset(values)
          options.onSuccess?.(result, values)
          return
        }

        for (const [name, message] of Object.entries(
          result.fieldErrors ?? {}
        )) {
          form.setError(name as Path<T>, { message })
        }
        toast.add({ type: "error", title: result.error })
      }),
    () =>
      toast.add({ type: "error", title: "Please fix the highlighted fields." })
  )

  return { onSubmit, isPending }
}
