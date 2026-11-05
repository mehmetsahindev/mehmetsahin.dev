"use client"

import { useState } from "react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"

import { ConfirmDelete } from "../components/form/confirm-delete"
import { FormActions, FormSection } from "../components/form/form-layout"
import {
  EMPTY_ICON,
  IconPicker,
  type IconValue,
} from "../components/form/icon-picker"
import { MarkdownField } from "../components/form/markdown-field"
import { PeriodFields } from "../components/form/period-fields"
import { TagInput } from "../components/form/tag-input"
import { useActionSubmit } from "../hooks/use-action-submit"
import { deleteProjectAction, saveProjectAction } from "./actions"
import type { ProjectFormData } from "./queries"
import { projectSchema, type ProjectInput } from "./schemas"

export function ProjectForm({
  id,
  initial,
}: {
  id: string | null
  initial: ProjectFormData | null
}) {
  const router = useRouter()
  const [icon, setIcon] = useState<IconValue>(initial?.icon ?? EMPTY_ICON)

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: initial?.values ?? {
      title: "",
      url: "",
      startDate: "",
      endDate: null,
      description: "",
      skills: [],
      icon: { slug: null, mediaId: null },
      isExpanded: false,
    },
  })
  const { register, control, formState } = form
  const errors = formState.errors

  const { onSubmit, isPending } = useActionSubmit(
    form,
    (values) => saveProjectAction(id, values),
    {
      successMessage: id ? "Project saved" : "Project added",
      onSuccess: (result) => {
        if (!id && "data" in result) {
          router.replace(`/admin/projects/${result.data.id}` as Route)
        }
      },
    }
  )

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection
        title="Project"
        description="What it is and where to find it."
      >
        <Field data-invalid={Boolean(errors.title) || undefined}>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" {...register("title")} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={Boolean(errors.url) || undefined}>
          <FieldLabel htmlFor="url">Link</FieldLabel>
          <Input
            id="url"
            placeholder="https://github.com/you/project"
            {...register("url")}
          />
          <FieldDescription>
            Website, repository or demo. Optional.
          </FieldDescription>
          <FieldError errors={[errors.url]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="icon">Icon</FieldLabel>
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <IconPicker
                id="icon"
                value={icon}
                onChange={(value) => {
                  setIcon(value)
                  field.onChange({
                    slug: value.simpleIcon?.slug ?? null,
                    mediaId: value.media?.id ?? null,
                  })
                }}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Details"
        description="Period, technologies and a description."
      >
        <Controller
          control={control}
          name="endDate"
          render={({ field: endField }) => (
            <Controller
              control={control}
              name="startDate"
              render={({ field: startField }) => (
                <PeriodFields
                  start={startField.value}
                  end={endField.value}
                  onStartChange={startField.onChange}
                  onEndChange={endField.onChange}
                  currentLabel="Ongoing"
                  startError={errors.startDate?.message}
                  endError={errors.endDate?.message}
                />
              )}
            />
          )}
        />

        <Field>
          <FieldLabel htmlFor="skills">Technologies</FieldLabel>
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <TagInput
                id="skills"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <MarkdownField
                id="description"
                value={field.value}
                onChange={field.onChange}
                rows={8}
              />
            )}
          />
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="isExpanded">Expanded by default</FieldLabel>
            <FieldDescription>
              Show the description without a click.
            </FieldDescription>
          </FieldContent>
          <Controller
            control={control}
            name="isExpanded"
            render={({ field }) => (
              <Switch
                id="isExpanded"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormActions isPending={isPending} isDirty={formState.isDirty}>
        {id && (
          <ConfirmDelete
            title="Delete this project?"
            description="It will be removed from your site."
            onConfirm={async () => {
              await deleteProjectAction(id)
              toast.add({ type: "success", title: "Project deleted" })
              router.replace("/admin/projects")
            }}
          />
        )}
      </FormActions>
    </form>
  )
}
