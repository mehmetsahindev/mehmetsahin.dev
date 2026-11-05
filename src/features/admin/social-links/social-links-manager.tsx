"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AtSignIcon, PencilIcon, PlusIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
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
import type { SocialLinkData } from "@/features/portfolio/data/types"
import {
  getSocialPlatform,
  SOCIAL_PLATFORMS,
} from "@/features/portfolio/lib/social-platforms"

import { AdminPageHeader } from "../components/admin-page"
import { ConfirmDelete } from "../components/form/confirm-delete"
import { FormSheet } from "../components/form/form-sheet"
import { SortableList } from "../components/form/sortable-list"
import { ListEmpty } from "../components/list-empty"
import { useActionSubmit } from "../hooks/use-action-submit"
import { useSortableItems } from "../hooks/use-sortable-items"
import {
  deleteSocialLinkAction,
  reorderSocialLinksAction,
  saveSocialLinkAction,
} from "./actions"
import { socialLinkSchema, type SocialLinkInput } from "./schema"

type Editing = { link: SocialLinkData | null } | null

export function SocialLinksManager({ links }: { links: SocialLinkData[] }) {
  const [editing, setEditing] = useState<Editing>(null)
  const { ordered, onReorder, onCommit } = useSortableItems(
    links,
    reorderSocialLinksAction
  )

  const addButton = (
    <Button onClick={() => setEditing({ link: null })}>
      <PlusIcon />
      Add link
    </Button>
  )

  return (
    <>
      <AdminPageHeader
        title="Social links"
        description="Profiles shown on the home page and in the footer. Drag to reorder."
        actions={links.length > 0 ? addButton : undefined}
      />

      {ordered.length === 0 ? (
        <ListEmpty
          icon={<AtSignIcon />}
          title="No social links"
          description="Add the profiles you want visitors to find."
          action={addButton}
        />
      ) : (
        <SortableList
          items={ordered}
          getId={(link) => link.id}
          onReorder={onReorder}
          onCommit={onCommit}
          renderItem={(link) => {
            const platform = getSocialPlatform(link.platform)
            const Icon = platform.icon

            return (
              <div className="flex items-center gap-3 py-2.5 pr-2 pl-1">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-foreground/80 [&_svg]:size-4">
                  <Icon />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">
                    {platform.label}
                    {link.handle && (
                      <span className="ml-2 font-normal text-muted-foreground">
                        {link.handle}
                      </span>
                    )}
                  </span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {link.url}
                  </span>
                </div>
                {!link.sameAs && (
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    Not in structured data
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${platform.label}`}
                  onClick={() => setEditing({ link })}
                >
                  <PencilIcon />
                </Button>
              </div>
            )
          }}
        />
      )}

      {editing && (
        <SocialLinkSheet link={editing.link} onClose={() => setEditing(null)} />
      )}
    </>
  )
}

function SocialLinkSheet({
  link,
  onClose,
}: {
  link: SocialLinkData | null
  onClose: () => void
}) {
  const [open, setOpen] = useState(true)
  const close = () => {
    setOpen(false)
    // Let the closing animation finish before unmounting.
    setTimeout(onClose, 200)
  }

  const form = useForm<SocialLinkInput>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: link
      ? {
          platform: link.platform as SocialLinkInput["platform"],
          url: link.url,
          handle: link.handle,
          sameAs: link.sameAs,
        }
      : { platform: "github", url: "", handle: "", sameAs: true },
  })
  const { register, control, formState, watch } = form
  const errors = formState.errors
  const platform = getSocialPlatform(watch("platform"))

  const { onSubmit, isPending } = useActionSubmit(
    form,
    (values) => saveSocialLinkAction(link?.id ?? null, values),
    {
      successMessage: link ? "Link updated" : "Link added",
      onSuccess: close,
    }
  )

  return (
    <FormSheet
      open={open}
      onOpenChange={(next) => !next && close()}
      title={link ? "Edit social link" : "Add social link"}
      onSubmit={onSubmit}
      isPending={isPending}
      footerStart={
        link && (
          <ConfirmDelete
            title="Delete this link?"
            description={`${platform.label} will be removed from your site.`}
            onConfirm={async () => {
              await deleteSocialLinkAction(link.id)
              toast.add({ type: "success", title: "Link deleted" })
              close()
            }}
          />
        )
      }
    >
      <Field>
        <FieldLabel htmlFor="platform">Platform</FieldLabel>
        <Controller
          control={control}
          name="platform"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger id="platform" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOCIAL_PLATFORMS).map(([key, item]) => {
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

      <Field data-invalid={Boolean(errors.url) || undefined}>
        <FieldLabel htmlFor="url">URL</FieldLabel>
        <Input
          id="url"
          placeholder={platform.placeholder}
          aria-invalid={Boolean(errors.url) || undefined}
          {...register("url")}
        />
        <FieldError errors={[errors.url]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="handle">Handle</FieldLabel>
        <Input id="handle" placeholder="@username" {...register("handle")} />
        <FieldDescription>
          Shown in the tooltip next to the platform name.
        </FieldDescription>
      </Field>

      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="sameAs">Use as identity</FieldLabel>
          <FieldDescription>
            Tells search engines this profile is yours (JSON-LD sameAs).
          </FieldDescription>
        </FieldContent>
        <Controller
          control={control}
          name="sameAs"
          render={({ field }) => (
            <Switch
              id="sameAs"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </Field>
    </FormSheet>
  )
}
