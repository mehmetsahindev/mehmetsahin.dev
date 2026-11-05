"use client"

import { cn } from "@/lib/utils"

import { MarkdownEditor } from "./markdown-editor"

/**
 * Markdown form field for About and career descriptions: the same editor as
 * blog posts (toolbar, media, preview) at a compact size, previewed the way
 * these texts appear on the site. Media referenced here is tracked as used
 * when the record is saved.
 */
export function MarkdownField({
  id,
  value,
  onChange,
  rows = 5,
  placeholder,
  className,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  /** Rough size hint: 8 or more gives a taller editor. */
  rows?: number
  placeholder?: string
  className?: string
}) {
  return (
    <MarkdownEditor
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      renderer="description"
      className={cn(rows >= 8 ? "h-96" : "h-72", className)}
    />
  )
}
