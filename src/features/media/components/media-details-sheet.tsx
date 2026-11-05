"use client"

import { useEffect, useState, useTransition } from "react"
import type { Route } from "next"
import Link from "next/link"
import { formatBytes } from "@/utils/format"
import { format } from "date-fns"
import {
  ArrowUpRightIcon,
  ExternalLinkIcon,
  LinkIcon,
  Trash2Icon,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { CopyButton } from "@/components/copy-button"

import {
  deleteMediaAction,
  getMediaUsagesAction,
  updateMediaAltAction,
} from "../actions"
import { getMediaUrl } from "../lib/constants"
import type { MediaItem, MediaUsageItem } from "../types"
import { MediaThumbnail } from "./media-thumbnail"

export function MediaDetailsSheet({
  item,
  onOpenChange,
  onChanged,
}: {
  item: MediaItem | null
  onOpenChange: (open: boolean) => void
  /** Called after the alt text is saved or the file is deleted. */
  onChanged: () => void
}) {
  return (
    <Sheet open={item !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 data-[side=right]:sm:max-w-md">
        {item && (
          <MediaDetails
            key={item.id}
            item={item}
            onChanged={onChanged}
            onDeleted={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function MediaDetails({
  item,
  onChanged,
  onDeleted,
}: {
  item: MediaItem
  onChanged: () => void
  onDeleted: () => void
}) {
  const url = getMediaUrl(item.key)
  const [usages, setUsages] = useState<MediaUsageItem[] | null>(null)

  useEffect(() => {
    let active = true
    getMediaUsagesAction(item.id).then((result) => {
      if (active) setUsages(result)
    })
    return () => {
      active = false
    }
  }, [item.id])

  return (
    <>
      <SheetHeader className="border-b border-line p-4 pr-12">
        <SheetTitle className="truncate">{item.fileName}</SheetTitle>
        <SheetDescription>
          Uploaded {format(new Date(item.createdAt), "MMM d, yyyy")}
        </SheetDescription>
      </SheetHeader>

      <MediaThumbnail
        item={item}
        fit="contain"
        className="aspect-4/3 shrink-0 border-b border-line"
      />

      <div className="flex flex-col gap-6 p-4">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm [&_dd]:min-w-0 [&_dd]:truncate [&_dt]:text-muted-foreground">
          <dt>Type</dt>
          <dd className="font-mono text-xs/5">{item.mimeType}</dd>
          <dt>Size</dt>
          <dd className="font-mono text-xs/5">{formatBytes(item.size)}</dd>
          {item.width && item.height && (
            <>
              <dt>Dimensions</dt>
              <dd className="font-mono text-xs/5">
                {item.width} × {item.height}
              </dd>
            </>
          )}
          <dt>URL</dt>
          <dd className="flex items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="truncate font-mono text-xs/5 underline-offset-4 hover:underline"
            >
              {url}
            </a>
            <ExternalLinkIcon className="size-3 shrink-0 text-muted-foreground" />
          </dd>
        </dl>

        <div className="flex flex-wrap gap-2">
          <CopyButton
            className="w-auto gap-2 px-2.5"
            variant="outline"
            size="sm"
            text={url}
            aria-label="Copy URL"
            idleIcon={<LinkIcon />}
          >
            Copy URL
          </CopyButton>
          {item.kind === "image" && (
            <CopyButton
              className="w-auto gap-2 px-2.5"
              variant="outline"
              size="sm"
              text={`![${item.alt}](${url})`}
              aria-label="Copy Markdown"
            >
              Copy Markdown
            </CopyButton>
          )}
        </div>

        {item.kind === "image" && (
          <AltTextForm item={item} onSaved={onChanged} />
        )}

        <Separator />

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Used in</h3>
          <UsageList usages={usages} />
        </section>

        <Separator />

        <DeleteMedia
          item={item}
          isUsed={(usages?.length ?? item.usageCount) > 0}
          onDeleted={() => {
            onDeleted()
            onChanged()
          }}
        />
      </div>
    </>
  )
}

function AltTextForm({
  item,
  onSaved,
}: {
  item: MediaItem
  onSaved: () => void
}) {
  const [alt, setAlt] = useState(item.alt)
  const [isPending, startTransition] = useTransition()
  const isDirty = alt.trim() !== item.alt

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        startTransition(async () => {
          const result = await updateMediaAltAction(item.id, alt)
          if (result.ok) {
            toast.add({ type: "success", title: "Alt text saved" })
            onSaved()
          } else {
            toast.add({ type: "error", title: result.error })
          }
        })
      }}
    >
      <Field>
        <FieldLabel htmlFor="media-alt">Alt text</FieldLabel>
        <div className="flex gap-2">
          <Input
            id="media-alt"
            value={alt}
            maxLength={500}
            placeholder="Describe the image"
            onChange={(event) => setAlt(event.target.value)}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={!isDirty || isPending}
          >
            {isPending && <Spinner />}
            Save
          </Button>
        </div>
        <FieldDescription>
          Used for accessibility and when the image is inserted into a post.
        </FieldDescription>
      </Field>
    </form>
  )
}

function UsageList({ usages }: { usages: MediaUsageItem[] | null }) {
  if (usages === null) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-2/3" />
      </div>
    )
  }

  if (usages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Not used anywhere yet. It can be deleted safely.
      </p>
    )
  }

  return (
    <ul className="flex flex-col overflow-hidden rounded-lg border border-line">
      {usages.map((usage) => (
        <li
          key={`${usage.entityType}:${usage.entityId}:${usage.field}`}
          className="border-b border-line last:border-b-0"
        >
          <Link
            href={usage.href as Route}
            className="group flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent/50"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium">{usage.label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {usage.entityType} · {usage.field}
              </span>
            </div>
            <ArrowUpRightIcon className="size-4 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

function DeleteMedia({
  item,
  isUsed,
  onDeleted,
}: {
  item: MediaItem
  isUsed: boolean
  onDeleted: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteMediaAction(item.id)
      if (result.ok) {
        toast.add({ type: "success", title: "File deleted" })
        setOpen(false)
        onDeleted()
      } else {
        toast.add({ type: "error", title: result.error })
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="w-fit" disabled={isUsed} />
          }
        >
          <Trash2Icon />
          Delete file
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              {item.fileName} will be removed permanently. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirm}
              disabled={isPending}
            >
              {isPending && <Spinner />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isUsed && (
        <p className="text-sm text-muted-foreground">
          Files that are in use cannot be deleted. Remove them from the places
          above first.
        </p>
      )}
    </div>
  )
}
