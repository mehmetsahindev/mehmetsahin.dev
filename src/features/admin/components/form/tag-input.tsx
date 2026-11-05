"use client"

import { useState } from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * List of short strings (skills, taglines, keywords). Enter or comma adds
 * the typed value; Backspace on an empty input removes the last one.
 */
export function TagInput({
  id,
  value,
  onChange,
  placeholder = "Type and press Enter",
  allowCommas = false,
  className,
}: {
  id?: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  /** Taglines may contain commas; then only Enter adds. */
  allowCommas?: boolean
  className?: string
}) {
  const [draft, setDraft] = useState("")

  const add = (raw: string) => {
    const next = raw.trim()
    if (next && !value.includes(next)) onChange([...value, next])
    setDraft("")
  }

  return (
    <div
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex max-w-full items-center gap-1 rounded-md bg-muted py-0.5 pr-1 pl-2 text-xs"
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            className="rounded-sm text-muted-foreground hover:text-foreground"
            onClick={() => onChange(value.filter((item) => item !== tag))}
            aria-label={`Remove ${tag}`}
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-24 flex-1 bg-transparent py-0.5 outline-none placeholder:text-muted-foreground"
        onChange={(event) => {
          const next = event.target.value
          if (!allowCommas && next.includes(",")) {
            next.split(",").slice(0, -1).forEach(add)
            setDraft(next.split(",").at(-1) ?? "")
          } else {
            setDraft(next)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            add(draft)
          } else if (event.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={() => add(draft)}
      />
    </div>
  )
}
