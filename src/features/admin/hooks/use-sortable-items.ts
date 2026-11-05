"use client"

import { useCallback, useRef, useState } from "react"

import { toast } from "@/components/ui/toast"

/**
 * Local copy of a server-provided list that can be reordered by dragging.
 * The new order is saved when a drag ends; server refreshes replace it.
 */
export function useSortableItems<T extends { id: string }>(
  items: T[],
  saveOrder: (ids: string[]) => Promise<{ ok: boolean }>
) {
  const [ordered, setOrdered] = useState(items)
  const [source, setSource] = useState(items)
  const latest = useRef(items)

  // Fresh server data replaces the local order (adjusting state in render).
  if (items !== source) {
    setSource(items)
    setOrdered(items)
  }

  const onReorder = useCallback((next: T[]) => {
    latest.current = next
    setOrdered(next)
  }, [])

  const onCommit = useCallback(async () => {
    const result = await saveOrder(latest.current.map((item) => item.id))
    if (!result.ok) {
      toast.add({ type: "error", title: "Could not save the new order." })
    }
  }, [saveOrder])

  return { ordered, onReorder, onCommit }
}
