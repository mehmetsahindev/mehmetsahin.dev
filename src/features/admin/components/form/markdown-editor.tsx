"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { languages } from "@codemirror/language-data"
import { EditorView } from "@codemirror/view"
import { tags } from "@lezer/highlight"
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import {
  BoldIcon,
  CodeIcon,
  Columns2Icon,
  EyeIcon,
  Heading2Icon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  PencilLineIcon,
  QuoteIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MediaPicker } from "@/features/media/components/media-picker"
import { useMediaUpload } from "@/features/media/hooks/use-media-upload"
import { getMediaUrl } from "@/features/media/lib/constants"
import type { MediaItem } from "@/features/media/types"

import {
  renderPreviewAction,
  type MarkdownRenderer,
} from "./markdown-preview-action"

type Mode = "write" | "preview" | "split"

const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    color: "var(--foreground)",
    fontSize: "0.875rem",
    height: "100%",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.7",
  },
  ".cm-content": { padding: "1rem 0", caretColor: "var(--foreground)" },
  ".cm-line": { padding: "0 1rem" },
  ".cm-cursor": { borderLeftColor: "var(--foreground)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
    {
      backgroundColor:
        "color-mix(in oklab, var(--foreground) 15%, transparent) !important",
    },
  ".cm-activeLine": { backgroundColor: "transparent" },
  ".cm-gutters": { display: "none" },
  ".cm-placeholder": { color: "var(--muted-foreground)" },
})

const highlightStyle = HighlightStyle.define([
  { tag: tags.heading, fontWeight: "600", color: "var(--foreground)" },
  { tag: tags.strong, fontWeight: "600" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  {
    tag: [tags.link, tags.url],
    color: "var(--muted-foreground)",
    textDecoration: "underline",
  },
  { tag: tags.quote, color: "var(--muted-foreground)", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "var(--foreground)",
    backgroundColor: "color-mix(in oklab, var(--foreground) 6%, transparent)",
  },
  {
    tag: [
      tags.processingInstruction,
      tags.meta,
      tags.contentSeparator,
      tags.list,
    ],
    color: "var(--muted-foreground)",
  },
  { tag: [tags.keyword, tags.tagName], color: "#c678dd" },
  { tag: [tags.string, tags.attributeValue], color: "#98c379" },
  { tag: [tags.number, tags.bool, tags.atom], color: "#d19a66" },
  { tag: tags.comment, color: "var(--muted-foreground)", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.typeName], color: "#61afef" },
])

export function MarkdownEditor({
  id,
  value,
  onChange,
  placeholder = "Write in Markdown…",
  renderer = "post",
  className,
}: {
  /** Set on the editable area so a `<label htmlFor>` focuses it. */
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Which site renderer the preview uses. */
  renderer?: MarkdownRenderer
  /** Size of the editor; defaults to a tall, flexible area for posts. */
  className?: string
}) {
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const canSplit = useCanSplit(rootRef)
  const [mode, setMode] = useState<Mode>("split")
  const [pickerOpen, setPickerOpen] = useState(false)

  const extensions = useMemo(
    () => [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      syntaxHighlighting(highlightStyle),
      EditorView.lineWrapping,
      editorTheme,
      ...(id ? [EditorView.contentAttributes.of({ id })] : []),
    ],
    [id]
  )

  /** Replaces the selection, or wraps it when `after` is given. */
  const insert = (before: string, after = "", fallback = "") => {
    const view = editorRef.current?.view
    if (!view) return
    const { from, to } = view.state.selection.main
    const selected = view.state.sliceDoc(from, to) || fallback
    view.dispatch({
      changes: { from, to, insert: `${before}${selected}${after}` },
      selection: {
        anchor: from + before.length,
        head: from + before.length + selected.length,
      },
    })
    view.focus()
  }

  /** Inserts a block (image) on its own paragraph at the cursor. */
  const insertBlock = (text: string) => {
    const view = editorRef.current?.view
    if (!view) return
    const { from, to } = view.state.selection.main
    const before = view.state.sliceDoc(0, from)
    const prefix =
      !before || before.endsWith("\n\n")
        ? ""
        : before.endsWith("\n")
          ? "\n"
          : "\n\n"
    const insertText = `${prefix}${text}\n\n`
    view.dispatch({
      changes: { from, to, insert: insertText },
      selection: { anchor: from + insertText.length },
    })
    view.focus()
  }

  const insertMedia = (item: MediaItem) => {
    const url = getMediaUrl(item.key)
    if (item.kind === "image") {
      insertBlock(`![${item.alt || ""}](${url})`)
    } else {
      insert(`[${item.fileName}](${url})`)
    }
  }

  const { upload, isUploading } = useMediaUpload({
    onUploaded: (items) => items.forEach(insertMedia),
  })

  const handleFiles = (files: FileList | null | undefined) => {
    if (!files?.length) return false
    const images = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    )
    if (images.length === 0) return false
    void upload(images)
    return true
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        // Split view depends on the editor's own width (it also lives in
        // narrow sheets), so it uses container queries.
        "@container/editor flex flex-col overflow-hidden rounded-xl border border-line",
        className ?? "min-h-128 flex-1"
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-muted/20 px-2 py-1.5">
        <ToolbarButton
          label="Heading"
          onClick={() => insert("## ", "", "Heading")}
        >
          <Heading2Icon />
        </ToolbarButton>
        <ToolbarButton label="Bold" onClick={() => insert("**", "**", "bold")}>
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          onClick={() => insert("_", "_", "italic")}
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          onClick={() => insert("[", "](https://)", "text")}
        >
          <LinkIcon />
        </ToolbarButton>
        <ToolbarButton label="List" onClick={() => insert("- ", "", "item")}>
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => insert("> ", "", "quote")}>
          <QuoteIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          onClick={() => insert("```ts\n", "\n```", "code")}
        >
          <CodeIcon />
        </ToolbarButton>

        <Separator
          orientation="vertical"
          className="mx-1 data-vertical:h-5 data-vertical:self-center"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setPickerOpen(true)}
          disabled={isUploading}
        >
          {isUploading ? <Spinner /> : <ImagePlusIcon />}
          Media
        </Button>

        <ToggleGroup
          className="ml-auto"
          variant="outline"
          size="sm"
          // A narrow editor shows split as plain writing; reflect that.
          value={[mode === "split" && !canSplit ? "write" : mode]}
          onValueChange={(next) => next[0] && setMode(next[0] as Mode)}
        >
          <ToggleGroupItem value="write" aria-label="Write">
            <PencilLineIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="split"
            aria-label="Side by side"
            className="@max-xl/editor:hidden"
          >
            <Columns2Icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="preview" aria-label="Preview">
            <EyeIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1",
          mode === "split" && "@xl/editor:grid-cols-2"
        )}
      >
        <div
          className={cn(
            "min-h-0",
            mode === "preview" && "hidden",
            mode === "split" && "@xl/editor:border-r @xl/editor:border-line"
          )}
          onDropCapture={(event) => {
            if (handleFiles(event.dataTransfer.files)) event.preventDefault()
          }}
          onPasteCapture={(event) => {
            if (handleFiles(event.clipboardData.files)) event.preventDefault()
          }}
        >
          <CodeMirror
            ref={editorRef}
            value={value}
            onChange={onChange}
            extensions={extensions}
            placeholder={placeholder}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
            }}
            theme="none"
            height="100%"
            className="h-full"
          />
        </div>

        {mode !== "write" && (
          <MarkdownPreview
            markdown={value}
            renderer={renderer}
            // Too narrow for two columns: split falls back to the editor.
            className={cn(mode === "split" && "@max-xl/editor:hidden")}
          />
        )}
      </div>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={insertMedia}
        title="Insert media"
        description="Pick a file, or drop and paste images straight into the editor."
      />
    </div>
  )
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/** Debounced server-rendered preview using the site's Markdown pipeline. */
function MarkdownPreview({
  markdown: source,
  renderer,
  className,
}: {
  markdown: string
  renderer: MarkdownRenderer
  className?: string
}) {
  const [preview, setPreview] = useState<React.ReactNode>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setIsLoading(true)
      renderPreviewAction(source, renderer)
        .then((node) => {
          if (active) setPreview(node)
        })
        .finally(() => {
          if (active) setIsLoading(false)
        })
    }, 400)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [source, renderer])

  return (
    <div
      className={cn("relative min-h-0 overflow-y-auto px-6 py-4", className)}
    >
      {isLoading && (
        <Spinner className="absolute top-3 right-3 text-muted-foreground" />
      )}
      {preview ?? (
        <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
      )}
    </div>
  )
}

/** Matches the `@xl/editor` container breakpoint (36rem). */
const SPLIT_MIN_WIDTH = 576

function useCanSplit(ref: React.RefObject<HTMLDivElement | null>) {
  const [canSplit, setCanSplit] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = (width: number) => setCanSplit(width >= SPLIT_MIN_WIDTH)
    // Measure right away; observer callbacks only arrive with a rendered frame.
    measure(element.clientWidth)
    const observer = new ResizeObserver(([entry]) => {
      measure(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return canSplit
}
