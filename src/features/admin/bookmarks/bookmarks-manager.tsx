"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { BookmarkIcon, PencilIcon, PlusIcon, TagsIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

import { IconPreview } from "../career/project-icon"
import { AdminPageHeader } from "../components/admin-page"
import { ConfirmDelete } from "../components/form/confirm-delete"
import { FormSheet } from "../components/form/form-sheet"
import { IconPicker, type IconValue } from "../components/form/icon-picker"
import { NameDialog } from "../components/form/name-dialog"
import { SortableList } from "../components/form/sortable-list"
import { ListEmpty } from "../components/list-empty"
import { useActionSubmit } from "../hooks/use-action-submit"
import { useSortableItems } from "../hooks/use-sortable-items"
import {
  deleteBookmarkAction,
  deleteBookmarkCategoryAction,
  reorderBookmarkCategoriesAction,
  reorderBookmarksAction,
  saveBookmarkAction,
  saveBookmarkCategoryAction,
} from "./actions"
import type { BookmarkAdmin, BookmarkCategoryAdmin } from "./queries"
import { bookmarkSchema, type BookmarkInput } from "./schema"

export function BookmarksManager({
  bookmarks,
  categories,
}: {
  bookmarks: BookmarkAdmin[]
  categories: BookmarkCategoryAdmin[]
}) {
  const [editing, setEditing] = useState<{ item: BookmarkAdmin | null } | null>(
    null
  )
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const { ordered, onReorder, onCommit } = useSortableItems(
    bookmarks,
    reorderBookmarksAction
  )
  const categoryName = new Map(categories.map((item) => [item.id, item.name]))

  const addButton = (
    <Button
      onClick={() => setEditing({ item: null })}
      disabled={categories.length === 0}
    >
      <PlusIcon />
      Add bookmark
    </Button>
  )

  return (
    <>
      <AdminPageHeader
        title="Bookmarks"
        description="Links worth sharing. Drag to reorder."
        actions={
          <>
            <Button variant="outline" onClick={() => setCategoriesOpen(true)}>
              <TagsIcon />
              Categories
            </Button>
            {bookmarks.length > 0 && addButton}
          </>
        }
      />

      {ordered.length === 0 ? (
        <ListEmpty
          icon={<BookmarkIcon />}
          title="No bookmarks yet"
          description={
            categories.length === 0
              ? "Create a category first."
              : "Save articles, courses, books and tools you recommend."
          }
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
              <IconPreview
                icon={item.icon}
                fallback={
                  <BookmarkIcon className="size-4 text-muted-foreground" />
                }
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {item.title}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {[
                    item.author,
                    format(new Date(item.bookmarkedAt), "d MMM yyyy"),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">
                {categoryName.get(item.categoryId)}
              </Badge>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${item.title}`}
                onClick={() => setEditing({ item })}
              >
                <PencilIcon />
              </Button>
            </div>
          )}
        />
      )}

      {editing && (
        <BookmarkSheet
          item={editing.item}
          categories={categories}
          onClose={() => setEditing(null)}
        />
      )}

      <CategoriesDialog
        open={categoriesOpen}
        onOpenChange={setCategoriesOpen}
        categories={categories}
      />
    </>
  )
}

function today() {
  return format(new Date(), "yyyy-MM-dd")
}

function BookmarkSheet({
  item,
  categories,
  onClose,
}: {
  item: BookmarkAdmin | null
  categories: BookmarkCategoryAdmin[]
  onClose: () => void
}) {
  const [open, setOpen] = useState(true)
  const close = () => {
    setOpen(false)
    setTimeout(onClose, 200)
  }
  const [icon, setIcon] = useState<IconValue>(
    item?.icon ?? { simpleIcon: null, media: null }
  )

  const form = useForm<BookmarkInput>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      categoryId: item?.categoryId ?? categories[0]?.id ?? "",
      title: item?.title ?? "",
      url: item?.url ?? "",
      author: item?.author ?? "",
      note: item?.note ?? "",
      icon: {
        slug: item?.icon.simpleIcon?.slug ?? null,
        mediaId: item?.icon.media?.id ?? null,
      },
      bookmarkedAt: item?.bookmarkedAt ?? today(),
    },
  })
  const { register, control, formState } = form
  const errors = formState.errors

  const { onSubmit, isPending } = useActionSubmit(
    form,
    (values) => saveBookmarkAction(item?.id ?? null, values),
    {
      successMessage: item ? "Bookmark saved" : "Bookmark added",
      onSuccess: close,
    }
  )

  const categoryItems = Object.fromEntries(
    categories.map((category) => [category.id, category.name])
  )

  return (
    <FormSheet
      open={open}
      onOpenChange={(next) => !next && close()}
      title={item ? "Edit bookmark" : "Add bookmark"}
      onSubmit={onSubmit}
      isPending={isPending}
      footerStart={
        item && (
          <ConfirmDelete
            title="Delete this bookmark?"
            description={`${item.title} will be removed from your bookmarks.`}
            onConfirm={async () => {
              await deleteBookmarkAction(item.id)
              toast.add({ type: "success", title: "Bookmark deleted" })
              close()
            }}
          />
        )
      }
    >
      <Field data-invalid={Boolean(errors.url) || undefined}>
        <FieldLabel htmlFor="url">URL</FieldLabel>
        <Input id="url" placeholder="https://" {...register("url")} />
        <FieldError errors={[errors.url]} />
      </Field>

      <Field data-invalid={Boolean(errors.title) || undefined}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" {...register("title")} />
        <FieldError errors={[errors.title]} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="author">Author</FieldLabel>
          <Input id="author" {...register("author")} />
        </Field>
        <Field data-invalid={Boolean(errors.bookmarkedAt) || undefined}>
          <FieldLabel htmlFor="bookmarkedAt">Date</FieldLabel>
          <Input id="bookmarkedAt" type="date" {...register("bookmarkedAt")} />
          <FieldError errors={[errors.bookmarkedAt]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="categoryId">Category</FieldLabel>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              items={categoryItems}
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="note">Why it is worth it</FieldLabel>
        <Textarea id="note" rows={3} {...register("note")} />
        <FieldDescription>
          One or two sentences, shown on the card.
        </FieldDescription>
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
        <FieldDescription>
          Optional. Without one, a generic icon is shown.
        </FieldDescription>
      </Field>
    </FormSheet>
  )
}

function CategoriesDialog({
  open,
  onOpenChange,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: BookmarkCategoryAdmin[]
}) {
  const [naming, setNaming] = useState<{
    category: BookmarkCategoryAdmin | null
  } | null>(null)
  const { ordered, onReorder, onCommit } = useSortableItems(
    categories,
    reorderBookmarkCategoriesAction
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90svh,40rem)] flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bookmark categories</DialogTitle>
          <DialogDescription>
            Used as filters on the bookmarks page. Drag to reorder.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <SortableList
            items={ordered}
            getId={(category) => category.id}
            onReorder={onReorder}
            onCommit={onCommit}
            renderItem={(category) => (
              <div className="flex items-center gap-2 px-1 py-1.5">
                <span className="flex-1 truncate text-sm">{category.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {category.bookmarkCount}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Rename ${category.name}`}
                  onClick={() => setNaming({ category })}
                >
                  <PencilIcon />
                </Button>
                <ConfirmDelete
                  iconOnly
                  disabled={category.bookmarkCount > 0}
                  label={
                    category.bookmarkCount > 0
                      ? `${category.name} has bookmarks and cannot be deleted`
                      : `Delete ${category.name}`
                  }
                  title="Delete this category?"
                  description={`${category.name} will be removed.`}
                  onConfirm={async () => {
                    const result = await deleteBookmarkCategoryAction(
                      category.id
                    )
                    if (!result.ok) {
                      toast.add({ type: "error", title: result.error })
                      return false
                    }
                    toast.add({ type: "success", title: "Category deleted" })
                  }}
                />
              </div>
            )}
          />
        </div>

        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setNaming({ category: null })}
        >
          <PlusIcon />
          Add category
        </Button>

        <NameDialog
          open={naming !== null}
          onOpenChange={(next) => !next && setNaming(null)}
          title={naming?.category ? "Rename category" : "New category"}
          initialValue={naming?.category?.name}
          submitLabel={naming?.category ? "Save" : "Create"}
          onSubmit={(name) =>
            saveBookmarkCategoryAction(naming?.category?.id ?? null, name)
          }
        />
      </DialogContent>
    </Dialog>
  )
}
