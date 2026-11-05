"use client"

import { useState, useTransition } from "react"

import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { HOME_SECTIONS } from "@/features/portfolio/lib/home-sections"

import { FormSection } from "../components/form/form-layout"
import { saveHomeSectionsAction } from "./actions"

/** Toggles save immediately; there is no separate save button. */
export function HomeSectionsForm({
  initial,
}: {
  initial: Record<string, boolean>
}) {
  const [values, setValues] = useState(initial)
  const [, startTransition] = useTransition()

  const toggle = (id: string, visible: boolean) => {
    const next = { ...values, [id]: visible }
    setValues(next)
    startTransition(async () => {
      const result = await saveHomeSectionsAction(next)
      if (result.ok) {
        toast.add({
          type: "success",
          title: visible ? "Section shown" : "Section hidden",
        })
      } else {
        setValues(values)
        toast.add({ type: "error", title: result.error })
      }
    })
  }

  return (
    <FormSection
      title="Home page sections"
      description="Hide sections you are not ready to show. Sections without content are hidden automatically."
    >
      <div className="flex flex-col overflow-hidden rounded-xl border border-line">
        {HOME_SECTIONS.map((section) => (
          <Field
            key={section.id}
            orientation="horizontal"
            className="border-b border-line px-4 py-3 last:border-b-0"
          >
            <FieldContent>
              <FieldLabel htmlFor={`section-${section.id}`}>
                {section.label}
              </FieldLabel>
            </FieldContent>
            <Switch
              id={`section-${section.id}`}
              checked={values[section.id] !== false}
              onCheckedChange={(checked) => toggle(section.id, checked)}
            />
          </Field>
        ))}
      </div>
    </FormSection>
  )
}
