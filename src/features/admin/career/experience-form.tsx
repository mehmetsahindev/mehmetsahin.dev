"use client"

import { useState } from "react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronRightIcon, PlusIcon, Trash2Icon } from "lucide-react"
import {
  Controller,
  useFieldArray,
  useForm,
  type FieldErrors,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { MediaField } from "@/features/media/components/media-field"
import type { MediaItem } from "@/features/media/types"
import { formatMonth } from "@/features/portfolio/lib/dates"
import { POSITION_ICONS } from "@/features/portfolio/lib/position-icons"

import { ConfirmDelete } from "../components/form/confirm-delete"
import { FormActions, FormSection } from "../components/form/form-layout"
import { MarkdownField } from "../components/form/markdown-field"
import { PeriodFields } from "../components/form/period-fields"
import { SortableList } from "../components/form/sortable-list"
import { TagInput } from "../components/form/tag-input"
import { useActionSubmit } from "../hooks/use-action-submit"
import { deleteExperienceAction, saveExperienceAction } from "./actions"
import type { ExperienceFormData } from "./queries"
import {
  EMPLOYMENT_TYPES,
  experienceSchema,
  LOCATION_TYPES,
  type ExperienceInput,
  type PositionInput,
} from "./schemas"

const NONE = "__none__"

const LOCATION_ITEMS = {
  [NONE]: "Not specified",
  ...Object.fromEntries(LOCATION_TYPES.map((type) => [type, type])),
}
const EMPLOYMENT_ITEMS = {
  [NONE]: "Not specified",
  ...Object.fromEntries(EMPLOYMENT_TYPES.map((type) => [type, type])),
}
const ICON_ITEMS = Object.fromEntries(
  Object.entries(POSITION_ICONS).map(([key, item]) => [key, item.label])
)

function emptyPosition(): PositionInput {
  return {
    id: null,
    title: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: null,
    description: "",
    skills: [],
    icon: "code",
    isExpanded: false,
  }
}

export function ExperienceForm({
  id,
  initial,
}: {
  id: string | null
  initial: ExperienceFormData | null
}) {
  const router = useRouter()
  const [logo, setLogo] = useState<MediaItem | null>(initial?.logo ?? null)

  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initial?.values ?? {
      companyName: "",
      companyWebsite: "",
      logoId: null,
      location: "",
      locationType: "",
      positions: [emptyPosition()],
    },
  })
  const { register, control, formState } = form
  const errors = formState.errors

  const positions = useFieldArray({
    control,
    name: "positions",
    keyName: "key",
  })

  const { onSubmit, isPending } = useActionSubmit(
    form,
    (values) => saveExperienceAction(id, values),
    {
      successMessage: id ? "Experience saved" : "Experience added",
      onSuccess: (result) => {
        if (!id && "data" in result) {
          router.replace(`/admin/experience/${result.data.id}` as Route)
        }
      },
    }
  )

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection title="Company" description="Where you worked.">
        <Field data-invalid={Boolean(errors.companyName) || undefined}>
          <FieldLabel htmlFor="companyName">Company name</FieldLabel>
          <Input id="companyName" {...register("companyName")} />
          <FieldError errors={[errors.companyName]} />
        </Field>

        <Field data-invalid={Boolean(errors.companyWebsite) || undefined}>
          <FieldLabel htmlFor="companyWebsite">Website</FieldLabel>
          <Input
            id="companyWebsite"
            placeholder="https://example.com"
            {...register("companyWebsite")}
          />
          <FieldError errors={[errors.companyWebsite]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="Istanbul, Türkiye"
              {...register("location")}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="locationType">Work arrangement</FieldLabel>
            <Controller
              control={control}
              name="locationType"
              render={({ field }) => (
                <Select
                  items={LOCATION_ITEMS}
                  value={field.value || NONE}
                  onValueChange={(value) =>
                    field.onChange(value === NONE ? "" : value)
                  }
                >
                  <SelectTrigger id="locationType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Not specified</SelectItem>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="logo">Logo</FieldLabel>
          <Controller
            control={control}
            name="logoId"
            render={({ field }) => (
              <MediaField
                id="logo"
                value={logo}
                previewClassName="rounded-full"
                onChange={(item) => {
                  setLogo(item)
                  field.onChange(item?.id ?? null)
                }}
              />
            )}
          />
          <FieldDescription>
            Shown small and round next to the company name.
          </FieldDescription>
        </Field>
      </FormSection>

      <FormSection
        title="Positions"
        description="Roles you held, newest first. Drag to reorder. A position without an end month is shown as current."
      >
        <FieldError errors={[errors.positions?.root ?? errors.positions]} />

        <SortableList
          items={positions.fields}
          getId={(field) => field.key}
          onReorder={(next) => {
            // Reorder reports one adjacent swap at a time.
            const target = next.findIndex(
              (field, index) => field.key !== positions.fields[index]?.key
            )
            if (target === -1) return
            const from = positions.fields.findIndex(
              (field) => field.key === next[target].key
            )
            positions.move(from, target)
          }}
          className="rounded-xl"
          itemClassName="items-start [&>button]:pt-3.5 [&>button]:self-start"
          renderItem={(field) => {
            const index = positions.fields.findIndex(
              (item) => item.key === field.key
            )
            return (
              <PositionFields
                index={index}
                form={form}
                errors={errors.positions?.[index]}
                canRemove={positions.fields.length > 1}
                onRemove={() => positions.remove(index)}
              />
            )
          }}
        />

        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => positions.prepend(emptyPosition())}
        >
          <PlusIcon />
          Add position
        </Button>
      </FormSection>

      <FormActions isPending={isPending} isDirty={formState.isDirty}>
        {id && (
          <ConfirmDelete
            title="Delete this company?"
            description="The company and all its positions will be removed from your site."
            onConfirm={async () => {
              await deleteExperienceAction(id)
              toast.add({ type: "success", title: "Experience deleted" })
              router.replace("/admin/experience")
            }}
          />
        )}
      </FormActions>
    </form>
  )
}

function PositionFields({
  index,
  form,
  errors,
  canRemove,
  onRemove,
}: {
  index: number
  form: ReturnType<typeof useForm<ExperienceInput>>
  errors?: FieldErrors<PositionInput>
  canRemove: boolean
  onRemove: () => void
}) {
  const { register, control, watch } = form
  const prefix = `positions.${index}` as const

  // Saved positions start collapsed so rows stay short enough to drag.
  const [isOpen, setIsOpen] = useState(() => !form.getValues(`${prefix}.id`))
  const open = isOpen || Boolean(errors)

  const title = watch(`${prefix}.title`)
  const startDate = watch(`${prefix}.startDate`)
  const endDate = watch(`${prefix}.endDate`)

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 py-2 pr-2">
        <button
          type="button"
          onClick={() => setIsOpen(!open)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-90"
            )}
          />
          <span className="truncate text-sm font-medium">
            {title || (
              <span className="text-muted-foreground">Untitled position</span>
            )}
          </span>
          {startDate && (
            <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {formatMonth(startDate)} —{" "}
              {endDate ? formatMonth(endDate) : "Present"}
            </span>
          )}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          disabled={!canRemove}
          onClick={onRemove}
          aria-label="Remove position"
        >
          <Trash2Icon />
        </Button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-dashed border-line py-4 pr-4 pl-6">
          <Field data-invalid={Boolean(errors?.title) || undefined}>
            <FieldLabel htmlFor={`${prefix}.title`}>Title</FieldLabel>
            <Input id={`${prefix}.title`} {...register(`${prefix}.title`)} />
            <FieldError errors={[errors?.title]} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${prefix}.employmentType`}>Type</FieldLabel>
              <Controller
                control={control}
                name={`${prefix}.employmentType`}
                render={({ field }) => (
                  <Select
                    items={EMPLOYMENT_ITEMS}
                    value={field.value || NONE}
                    onValueChange={(value) =>
                      field.onChange(value === NONE ? "" : value)
                    }
                  >
                    <SelectTrigger
                      id={`${prefix}.employmentType`}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Not specified</SelectItem>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${prefix}.icon`}>Icon</FieldLabel>
              <Controller
                control={control}
                name={`${prefix}.icon`}
                render={({ field }) => (
                  <Select
                    items={ICON_ITEMS}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger id={`${prefix}.icon`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(POSITION_ICONS).map(([key, item]) => {
                        const Icon = item.icon
                        return (
                          <SelectItem key={key} value={key}>
                            <Icon className="size-4" />
                            {item.label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <Controller
            control={control}
            name={`${prefix}.endDate`}
            render={({ field: endField }) => (
              <Controller
                control={control}
                name={`${prefix}.startDate`}
                render={({ field: startField }) => (
                  <PeriodFields
                    start={startField.value}
                    end={endField.value}
                    onStartChange={startField.onChange}
                    onEndChange={endField.onChange}
                    startError={errors?.startDate?.message}
                    endError={errors?.endDate?.message}
                  />
                )}
              />
            )}
          />

          <Field>
            <FieldLabel htmlFor={`${prefix}.skills`}>Skills</FieldLabel>
            <Controller
              control={control}
              name={`${prefix}.skills`}
              render={({ field }) => (
                <TagInput
                  id={`${prefix}.skills`}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`${prefix}.description`}>
              Description
            </FieldLabel>
            <Controller
              control={control}
              name={`${prefix}.description`}
              render={({ field }) => (
                <MarkdownField
                  id={`${prefix}.description`}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="- What you built and why it mattered"
                />
              )}
            />
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={`${prefix}.isExpanded`}>
                Expanded by default
              </FieldLabel>
              <FieldDescription>
                Show the description without a click.
              </FieldDescription>
            </FieldContent>
            <Controller
              control={control}
              name={`${prefix}.isExpanded`}
              render={({ field }) => (
                <Switch
                  id={`${prefix}.isExpanded`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </Field>
        </div>
      )}
    </div>
  )
}
