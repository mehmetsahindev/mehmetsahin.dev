"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LayersIcon, PencilIcon, PlusIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

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
  deleteTechCategoryAction,
  deleteTechItemAction,
  reorderTechCategoriesAction,
  reorderTechItemsAction,
  saveTechCategoryAction,
  saveTechItemAction,
} from "./actions"
import { IconPreview } from "./project-icon"
import type { TechCategoryAdmin, TechItemAdmin } from "./queries"
import { techItemSchema, type TechItemInput } from "./schemas"

type ItemEditing = {
  item: TechItemAdmin | null
  categoryId: string
} | null

export function TechStackManager({
  categories,
}: {
  categories: TechCategoryAdmin[]
}) {
  const [categoryDialog, setCategoryDialog] = useState<{
    category: TechCategoryAdmin | null
  } | null>(null)
  const [itemEditing, setItemEditing] = useState<ItemEditing>(null)
  const { ordered, onReorder, onCommit } = useSortableItems(
    categories,
    reorderTechCategoriesAction
  )

  const addCategoryButton = (
    <Button
      variant={categories.length > 0 ? "outline" : "default"}
      onClick={() => setCategoryDialog({ category: null })}
    >
      <PlusIcon />
      Add category
    </Button>
  )

  return (
    <>
      <AdminPageHeader
        title="Tech stack"
        description="Grouped by category, e.g. Languages or Tools. Drag categories and technologies to reorder."
        actions={categories.length > 0 ? addCategoryButton : undefined}
      />

      {ordered.length === 0 ? (
        <ListEmpty
          icon={<LayersIcon />}
          title="No categories yet"
          description="Create a category, then add technologies to it."
          action={addCategoryButton}
        />
      ) : (
        <SortableList
          items={ordered}
          getId={(category) => category.id}
          onReorder={onReorder}
          onCommit={onCommit}
          itemClassName="items-start [&>button]:self-start [&>button]:pt-4"
          renderItem={(category) => (
            <CategoryGroup
              category={category}
              onRename={() => setCategoryDialog({ category })}
              onAddItem={() =>
                setItemEditing({ item: null, categoryId: category.id })
              }
              onEditItem={(item) =>
                setItemEditing({ item, categoryId: category.id })
              }
            />
          )}
        />
      )}

      <NameDialog
        open={categoryDialog !== null}
        onOpenChange={(open) => !open && setCategoryDialog(null)}
        title={categoryDialog?.category ? "Rename category" : "New category"}
        initialValue={categoryDialog?.category?.name}
        submitLabel={categoryDialog?.category ? "Save" : "Create"}
        onSubmit={(name) =>
          saveTechCategoryAction(categoryDialog?.category?.id ?? null, name)
        }
      />

      {itemEditing && (
        <TechItemSheet
          item={itemEditing.item}
          categoryId={itemEditing.categoryId}
          categories={categories}
          onClose={() => setItemEditing(null)}
        />
      )}
    </>
  )
}

function CategoryGroup({
  category,
  onRename,
  onAddItem,
  onEditItem,
}: {
  category: TechCategoryAdmin
  onRename: () => void
  onAddItem: () => void
  onEditItem: (item: TechItemAdmin) => void
}) {
  const { ordered, onReorder, onCommit } = useSortableItems(
    category.items,
    reorderTechItemsAction
  )

  return (
    <div className="flex flex-col gap-3 py-3 pr-3 pl-1">
      <div className="flex items-center gap-2">
        <h3 className="flex-1 truncate text-sm font-medium">
          {category.name}
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            {category.items.length}
          </span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onAddItem}>
          <PlusIcon />
          Add
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Rename ${category.name}`}
          onClick={onRename}
        >
          <PencilIcon />
        </Button>
        <ConfirmDelete
          iconOnly
          label={`Delete ${category.name}`}
          title="Delete this category?"
          description={`${category.name} and its ${category.items.length} technologies will be removed.`}
          onConfirm={async () => {
            await deleteTechCategoryAction(category.id)
            toast.add({ type: "success", title: "Category deleted" })
          }}
        />
      </div>

      {ordered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-sm text-muted-foreground">
          No technologies in this category.
        </p>
      ) : (
        <SortableList
          items={ordered}
          getId={(item) => item.id}
          onReorder={onReorder}
          onCommit={onCommit}
          className="rounded-lg"
          renderItem={(item) => (
            <button
              type="button"
              onClick={() => onEditItem(item)}
              className="flex w-full items-center gap-3 py-2 pr-3 pl-1 text-left hover:bg-accent/40"
            >
              <IconPreview icon={item.icon} fallback={null} />
              <span className="flex-1 truncate text-sm">{item.name}</span>
              {item.url && (
                <span className="hidden max-w-56 truncate font-mono text-xs text-muted-foreground sm:block">
                  {item.url}
                </span>
              )}
            </button>
          )}
        />
      )}
    </div>
  )
}

function TechItemSheet({
  item,
  categoryId,
  categories,
  onClose,
}: {
  item: TechItemAdmin | null
  categoryId: string
  categories: TechCategoryAdmin[]
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

  const form = useForm<TechItemInput>({
    resolver: zodResolver(techItemSchema),
    defaultValues: {
      categoryId,
      name: item?.name ?? "",
      url: item?.url ?? "",
      icon: {
        slug: item?.icon.simpleIcon?.slug ?? null,
        mediaId: item?.icon.media?.id ?? null,
      },
    },
  })
  const { register, control, formState, setValue, getValues } = form
  const errors = formState.errors

  const { onSubmit, isPending } = useActionSubmit(
    form,
    (values) => saveTechItemAction(item?.id ?? null, values),
    {
      successMessage: item ? "Technology saved" : "Technology added",
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
      title={item ? "Edit technology" : "Add technology"}
      onSubmit={onSubmit}
      isPending={isPending}
      footerStart={
        item && (
          <ConfirmDelete
            title="Delete this technology?"
            description={`${item.name} will be removed from your stack.`}
            onConfirm={async () => {
              await deleteTechItemAction(item.id)
              toast.add({ type: "success", title: "Technology deleted" })
              close()
            }}
          />
        )
      }
    >
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
                // Picking a brand icon fills an empty name.
                if (value.simpleIcon && !getValues("name")) {
                  setValue("name", value.simpleIcon.title)
                }
              }}
            />
          )}
        />
      </Field>

      <Field data-invalid={Boolean(errors.name) || undefined}>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" {...register("name")} />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field data-invalid={Boolean(errors.url) || undefined}>
        <FieldLabel htmlFor="url">Link</FieldLabel>
        <Input id="url" placeholder="https://react.dev" {...register("url")} />
        <FieldError errors={[errors.url]} />
      </Field>

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
    </FormSheet>
  )
}
