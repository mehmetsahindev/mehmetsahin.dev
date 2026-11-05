"use client"

import { GripVerticalIcon } from "lucide-react"
import { Reorder, useDragControls } from "motion/react"

import { cn } from "@/lib/utils"

type SortableListProps<T> = {
  items: T[]
  getId: (item: T) => string
  /** Called with the new order while dragging; persist it in `onCommit`. */
  onReorder: (items: T[]) => void
  /** Called once when a drag ends. */
  onCommit?: () => void
  renderItem: (item: T) => React.ReactNode
  className?: string
  itemClassName?: string
}

/**
 * Vertical list ordered by dragging a handle. Rows stay clickable; only the
 * grip starts a drag.
 */
export function SortableList<T>({
  items,
  getId,
  onReorder,
  onCommit,
  renderItem,
  className,
  itemClassName,
}: SortableListProps<T>) {
  return (
    <Reorder.Group
      as="ul"
      axis="y"
      values={items}
      onReorder={onReorder}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-line",
        className
      )}
    >
      {items.map((item) => (
        <SortableRow
          key={getId(item)}
          item={item}
          onCommit={onCommit}
          className={itemClassName}
        >
          {renderItem(item)}
        </SortableRow>
      ))}
    </Reorder.Group>
  )
}

function SortableRow<T>({
  item,
  onCommit,
  className,
  children,
}: {
  item: T
  onCommit?: () => void
  className?: string
  children: React.ReactNode
}) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
      className={cn(
        "relative flex items-center gap-1 border-b border-line bg-background last:border-b-0",
        className
      )}
      whileDrag={{
        zIndex: 10,
        boxShadow: "0 8px 24px -8px rgb(0 0 0 / 0.25)",
      }}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="flex h-full cursor-grab touch-none items-center self-stretch pl-2 text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
        onPointerDown={(event) => controls.start(event)}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </Reorder.Item>
  )
}
