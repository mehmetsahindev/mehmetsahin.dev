"use client"

import { useState } from "react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { LOCALE_LABELS, LOCALES, type Locale } from "@/i18n/config"
import { slugify } from "@/utils/slugify"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ExternalLinkIcon, PlusIcon } from "lucide-react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { postPath } from "@/features/blog/lib/paths"
import { MediaField } from "@/features/media/components/media-field"
import type { MediaItem } from "@/features/media/types"

import { ConfirmDelete } from "../components/form/confirm-delete"
import { MarkdownEditor } from "../components/form/markdown-editor"
import { useActionSubmit } from "../hooks/use-action-submit"
import { deletePostAction, savePostAction } from "./actions"
import type { PostFormData } from "./queries"
import {
  postSchema,
  type PostInput,
  type PostStatus,
  type TranslationInput,
} from "./schema"

function emptyTranslation(locale: Locale): TranslationInput {
  return {
    locale,
    title: "",
    slug: "",
    description: "",
    content: "",
    status: "draft",
  }
}

export function PostEditor({
  id,
  initial,
}: {
  id: string | null
  initial: PostFormData | null
}) {
  const router = useRouter()
  const [cover, setCover] = useState<MediaItem | null>(initial?.cover ?? null)

  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: initial?.values ?? {
      coverId: null,
      publishedAt: format(new Date(), "yyyy-MM-dd"),
      pinned: false,
      translations: [emptyTranslation("en")],
    },
  })
  const { control, register, formState, setValue, getValues } = form
  const errors = formState.errors
  const translations = useFieldArray({ control, name: "translations" })
  const watched = useWatch({ control, name: "translations" })

  const [activeLocale, setActiveLocale] = useState<Locale>(
    translations.fields[0]?.locale ?? "en"
  )
  const activeIndex = Math.max(
    0,
    translations.fields.findIndex((field) => field.locale === activeLocale)
  )
  const prefix = `translations.${activeIndex}` as const
  const active = watched?.[activeIndex]
  const missingLocales = LOCALES.filter(
    (locale) => !translations.fields.some((field) => field.locale === locale)
  )

  // Slugs follow the title until edited by hand (or once saved).
  const [manualSlugs, setManualSlugs] = useState<Set<Locale>>(
    () => new Set(initial?.values.translations.map((item) => item.locale))
  )

  const { onSubmit, isPending } = useActionSubmit(
    form,
    (values) => savePostAction(id, values),
    {
      successMessage: id ? "Post saved" : "Post created",
      onSuccess: (result, values) => {
        setManualSlugs(new Set(values.translations.map((item) => item.locale)))
        if (!id && "data" in result) {
          router.replace(`/admin/blog/${result.data.id}` as Route)
        }
      },
    }
  )

  const translationErrors = errors.translations?.[activeIndex]
  const localesWithErrors = new Set(
    translations.fields.flatMap((field, index) =>
      errors.translations?.[index] ? [field.locale] : []
    )
  )

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[activeLocale]}
            onValueChange={(next) =>
              next[0] && setActiveLocale(next[0] as Locale)
            }
          >
            {translations.fields.map((field, index) => (
              <ToggleGroupItem
                key={field.id}
                value={field.locale}
                className="gap-2"
              >
                {LOCALE_LABELS[field.locale]}
                <StatusDot
                  status={watched?.[index]?.status ?? field.status}
                  hasError={localesWithErrors.has(field.locale)}
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {missingLocales.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button type="button" variant="ghost" size="sm" />}
              >
                <PlusIcon />
                Add translation
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {missingLocales.map((locale) => (
                  <DropdownMenuItem
                    key={locale}
                    onClick={() => {
                      translations.append(emptyTranslation(locale))
                      setActiveLocale(locale)
                    }}
                  >
                    {LOCALE_LABELS[locale]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {translations.fields.length > 1 && (
            <ConfirmDelete
              iconOnly
              label={`Remove ${LOCALE_LABELS[activeLocale]} translation`}
              title={`Remove the ${LOCALE_LABELS[activeLocale]} translation?`}
              description="It is deleted when you save the post."
              onConfirm={async () => {
                const remaining = translations.fields.filter(
                  (field) => field.locale !== activeLocale
                )
                translations.remove(activeIndex)
                setActiveLocale(remaining[0].locale)
              }}
            />
          )}
        </div>

        {/* Keyed by locale so each language keeps its own editor state. */}
        <div key={activeLocale} className="flex flex-col gap-4">
          <Field data-invalid={Boolean(translationErrors?.title) || undefined}>
            <FieldLabel htmlFor="title" className="sr-only">
              Title
            </FieldLabel>
            <input
              id="title"
              placeholder="Post title"
              className="w-full bg-transparent font-heading text-3xl font-medium tracking-tight outline-none placeholder:text-muted-foreground/60"
              {...register(`${prefix}.title`, {
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!manualSlugs.has(activeLocale)) {
                    setValue(`${prefix}.slug`, slugify(event.target.value), {
                      shouldDirty: true,
                    })
                  }
                },
              })}
            />
            <FieldError errors={[translationErrors?.title]} />
          </Field>

          <Controller
            control={control}
            name={`${prefix}.content`}
            render={({ field }) => (
              <MarkdownEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Write your post in Markdown…"
              />
            )}
          />
        </div>
      </div>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-height)+(--spacing(8)))] lg:self-start">
        <section
          key={activeLocale}
          className="flex flex-col gap-4 rounded-xl border border-line p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium">
              {LOCALE_LABELS[activeLocale]}
            </h2>
            {initial?.values.translations.some(
              (item) =>
                item.locale === activeLocale && item.status === "published"
            ) && (
              <a
                href={postPath(activeLocale, getValues(`${prefix}.slug`))}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                View
                <ExternalLinkIcon className="size-3" />
              </a>
            )}
          </div>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="status">Published</FieldLabel>
              <FieldDescription>Drafts are only visible here.</FieldDescription>
            </FieldContent>
            <Controller
              control={control}
              name={`${prefix}.status`}
              render={({ field }) => (
                <Switch
                  id="status"
                  checked={field.value === "published"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "published" : "draft")
                  }
                />
              )}
            />
          </Field>

          <Field data-invalid={Boolean(translationErrors?.slug) || undefined}>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              className="font-mono text-xs"
              {...register(`${prefix}.slug`, {
                onChange: () =>
                  setManualSlugs((current) =>
                    new Set(current).add(activeLocale)
                  ),
              })}
            />
            <FieldDescription className="truncate font-mono text-xs">
              {postPath(activeLocale, active?.slug || "…")}
            </FieldDescription>
            <FieldError errors={[translationErrors?.slug]} />
          </Field>

          <Field
            data-invalid={Boolean(translationErrors?.description) || undefined}
          >
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              rows={3}
              {...register(`${prefix}.description`)}
            />
            <FieldDescription>
              Shown under the title and in search results.
            </FieldDescription>
            <FieldError errors={[translationErrors?.description]} />
          </Field>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-line p-4">
          <h2 className="text-sm font-medium">All languages</h2>

          <Field data-invalid={Boolean(errors.publishedAt) || undefined}>
            <FieldLabel htmlFor="publishedAt">Publish date</FieldLabel>
            <Input id="publishedAt" type="date" {...register("publishedAt")} />
            <FieldError errors={[errors.publishedAt]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="cover">Cover image</FieldLabel>
            <Controller
              control={control}
              name="coverId"
              render={({ field }) => (
                <MediaField
                  id="cover"
                  value={cover}
                  className="p-2"
                  previewClassName="size-12"
                  onChange={(item) => {
                    setCover(item)
                    field.onChange(item?.id ?? null)
                  }}
                />
              )}
            />
            <FieldDescription>1200×630 works best.</FieldDescription>
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="pinned">Pin to top</FieldLabel>
            </FieldContent>
            <Controller
              control={control}
              name="pinned"
              render={({ field }) => (
                <Switch
                  id="pinned"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </Field>
        </section>

        <div className="flex items-center gap-2">
          {id && (
            <ConfirmDelete
              title="Delete this post?"
              description="All its translations will be removed. This cannot be undone."
              onConfirm={async () => {
                await deletePostAction(id)
                toast.add({ type: "success", title: "Post deleted" })
                router.replace("/admin/blog")
              }}
            />
          )}
          <Button type="submit" className="ml-auto" disabled={isPending}>
            {isPending && <Spinner />}
            {id ? "Save" : "Create post"}
          </Button>
        </div>
      </aside>
    </form>
  )
}

function StatusDot({
  status,
  hasError,
}: {
  status: PostStatus
  hasError: boolean
}) {
  return (
    <span
      className={cn(
        "size-1.5 rounded-full",
        hasError
          ? "bg-destructive"
          : status === "published"
            ? "bg-emerald-500"
            : "bg-muted-foreground/40"
      )}
      aria-label={hasError ? "Has errors" : status}
    />
  )
}

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <Badge
      variant={status === "published" ? "secondary" : "outline"}
      className="gap-1.5"
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "published" ? "bg-emerald-500" : "bg-muted-foreground/40"
        )}
      />
      {status === "published" ? "Published" : "Draft"}
    </Badge>
  )
}
