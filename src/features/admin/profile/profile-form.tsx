"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import {
  Field,
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
import { MediaField } from "@/features/media/components/media-field"
import type { MediaItem } from "@/features/media/types"

import { FormActions, FormSection } from "../components/form/form-layout"
import { MarkdownField } from "../components/form/markdown-field"
import { TagInput } from "../components/form/tag-input"
import { useActionSubmit } from "../hooks/use-action-submit"
import { saveProfileAction } from "./actions"
import type { ProfileFormData } from "./queries"
import { profileSchema, type ProfileInput } from "./schema"

export function ProfileForm({ initial }: { initial: ProfileFormData }) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial.values,
  })
  const { register, control, formState } = form
  const errors = formState.errors

  // Picked files are kept for previews; the form only stores their ids.
  const [avatar, setAvatar] = useState<MediaItem | null>(initial.avatar)
  const [ogImage, setOgImage] = useState<MediaItem | null>(initial.ogImage)

  const { onSubmit, isPending } = useActionSubmit(form, saveProfileAction, {
    successMessage: "Profile saved",
  })

  const timeZones = useMemo(() => Intl.supportedValuesOf("timeZone"), [])

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection
        title="Identity"
        description="How your name and role appear across the site."
      >
        <Field data-invalid={Boolean(errors.displayName) || undefined}>
          <FieldLabel htmlFor="displayName">Display name</FieldLabel>
          <Input id="displayName" {...register("displayName")} />
          <FieldError errors={[errors.displayName]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <Input id="firstName" {...register("firstName")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
            <Input id="lastName" {...register("lastName")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="jobTitle">Job title</FieldLabel>
            <Input id="jobTitle" {...register("jobTitle")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" {...register("username")} />
            <FieldDescription>
              Used in structured data for search engines.
            </FieldDescription>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
          <Controller
            control={control}
            name="avatarId"
            render={({ field }) => (
              <MediaField
                id="avatar"
                value={avatar}
                previewClassName="rounded-full"
                onChange={(item) => {
                  setAvatar(item)
                  field.onChange(item?.id ?? null)
                }}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Introduction"
        description="The short bio, the rotating taglines under your name and the About section."
      >
        <Field data-invalid={Boolean(errors.bio) || undefined}>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Input id="bio" {...register("bio")} />
          <FieldDescription>
            One sentence. Also used as the site description.
          </FieldDescription>
          <FieldError errors={[errors.bio]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="taglines">Taglines</FieldLabel>
          <Controller
            control={control}
            name="taglines"
            render={({ field }) => (
              <TagInput
                id="taglines"
                value={field.value}
                onChange={field.onChange}
                allowCommas
                placeholder="Type a tagline and press Enter"
              />
            )}
          />
          <FieldDescription>
            Shown one at a time in the profile header.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="about">About</FieldLabel>
          <Controller
            control={control}
            name="about"
            render={({ field }) => (
              <MarkdownField
                id="about"
                value={field.value}
                onChange={field.onChange}
                rows={8}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Contact"
        description="Shown in the overview on the home page. Email and phone are obfuscated in the HTML."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="Istanbul, Türkiye"
              {...register("location")}
            />
          </Field>
          <Field data-invalid={Boolean(errors.timeZone) || undefined}>
            <FieldLabel htmlFor="timeZone">Time zone</FieldLabel>
            <Controller
              control={control}
              name="timeZone"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="timeZone" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.timeZone]} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.email) || undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" {...register("email")} />
            <FieldError errors={[errors.email]} />
          </Field>
          <Field data-invalid={Boolean(errors.phone) || undefined}>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="+905551112233"
              {...register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Search and sharing"
        description="Keywords for search engines and the image shown when the site is shared."
      >
        <Field>
          <FieldLabel htmlFor="keywords">Keywords</FieldLabel>
          <Controller
            control={control}
            name="keywords"
            render={({ field }) => (
              <TagInput
                id="keywords"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="ogImage">Social image</FieldLabel>
          <Controller
            control={control}
            name="ogImageId"
            render={({ field }) => (
              <MediaField
                id="ogImage"
                value={ogImage}
                onChange={(item) => {
                  setOgImage(item)
                  field.onChange(item?.id ?? null)
                }}
              />
            )}
          />
          <FieldDescription>
            1200×630 recommended. Without one, an image is generated from your
            name and bio.
          </FieldDescription>
        </Field>
      </FormSection>

      <FormActions isPending={isPending} isDirty={formState.isDirty} />
    </form>
  )
}
