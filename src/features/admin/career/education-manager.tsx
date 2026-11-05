"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { GraduationCapIcon, PencilIcon, PlusIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { formatMonth } from "@/features/portfolio/lib/dates"

import { AdminPageHeader } from "../components/admin-page"
import { ConfirmDelete } from "../components/form/confirm-delete"
import { FormSheet } from "../components/form/form-sheet"
import { MarkdownField } from "../components/form/markdown-field"
import { PeriodFields } from "../components/form/period-fields"
import { SortableList } from "../components/form/sortable-list"
import { TagInput } from "../components/form/tag-input"
import { ListEmpty } from "../components/list-empty"
import { useActionSubmit } from "../hooks/use-action-submit"
import { useSortableItems } from "../hooks/use-sortable-items"
import {
  deleteEducationAction,
  reorderEducationAction,
  saveEducationAction,
} from "./actions"
import type { EducationListItem } from "./queries"
import { educationSchema, type EducationInput } from "./schemas"

export function EducationManager({ items }: { items: EducationListItem[] }) {
  const [editing, setEditing] = useState<{
    item: EducationListItem | null
  } | null>(null)
  const { ordered, onReorder, onCommit } = useSortableItems(
    items,
    reorderEducationAction
  )

  const addButton = (
    <Button onClick={() => setEditing({ item: null })}>
      <PlusIcon />
      Add education
    </Button>
  )

  return (
    <>
      <AdminPageHeader
        title="Education"
        description="Schools and degrees. Drag to reorder."
        actions={items.length > 0 ? addButton : undefined}
      />

      {ordered.length === 0 ? (
        <ListEmpty
          icon={<GraduationCapIcon />}
          title="No education yet"
          description="Add the schools you attended."
          action={addButton}
        />
      ) : (
        <SortableList
          items={ordered}
          getId={(item) => item.id}
          onReorder={onReorder}
          onCommit={onCommit}
          renderItem={(item) => (
            <div className="flex items-center gap-3 py-2.5 pr-2 pl-1">
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {item.school}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {[item.degree, item.fieldOfStudy]
                    .filter(Boolean)
                    .join(", ") || "No degree"}
                </span>
              </div>
              <span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:block">
                {formatMonth(item.startDate)} —{" "}
                {item.endDate ? formatMonth(item.endDate) : "Present"}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${item.school}`}
                onClick={() => setEditing({ item })}
              >
                <PencilIcon />
              </Button>
            </div>
          )}
        />
      )}

      {editing && (
        <EducationSheet item={editing.item} onClose={() => setEditing(null)} />
      )}
    </>
  )
}

function EducationSheet({
  item,
  onClose,
}: {
  item: EducationListItem | null
  onClose: () => void
}) {
  const [open, setOpen] = useState(true)
  const close = () => {
    setOpen(false)
    setTimeout(onClose, 200)
  }

  const form = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: item ?? {
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
      skills: [],
      isExpanded: false,
    },
  })
  const { register, control, formState } = form
  const errors = formState.errors

  const { onSubmit, isPending } = useActionSubmit(
    form,
    (values) => saveEducationAction(item?.id ?? null, values),
    {
      successMessage: item ? "Education saved" : "Education added",
      onSuccess: close,
    }
  )

  return (
    <FormSheet
      open={open}
      onOpenChange={(next) => !next && close()}
      title={item ? "Edit education" : "Add education"}
      onSubmit={onSubmit}
      isPending={isPending}
      footerStart={
        item && (
          <ConfirmDelete
            title="Delete this education?"
            description={`${item.school} will be removed from your site.`}
            onConfirm={async () => {
              await deleteEducationAction(item.id)
              toast.add({ type: "success", title: "Education deleted" })
              close()
            }}
          />
        )
      }
    >
      <Field data-invalid={Boolean(errors.school) || undefined}>
        <FieldLabel htmlFor="school">School</FieldLabel>
        <Input id="school" {...register("school")} />
        <FieldError errors={[errors.school]} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="degree">Degree</FieldLabel>
          <Input
            id="degree"
            placeholder="Bachelor's degree"
            {...register("degree")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="fieldOfStudy">Field of study</FieldLabel>
          <Input id="fieldOfStudy" {...register("fieldOfStudy")} />
        </Field>
      </div>

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
                currentLabel="I currently study here"
                startError={errors.startDate?.message}
                endError={errors.endDate?.message}
              />
            )}
          />
        )}
      />

      <Field>
        <FieldLabel htmlFor="skills">Skills</FieldLabel>
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
    </FormSheet>
  )
}
