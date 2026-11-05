"use client"

import { useCallback, useState } from "react"

import { toast } from "@/components/ui/toast"

import { isAllowedMimeType, MEDIA_MAX_SIZE } from "../lib/constants"
import type { MediaItem, UploadMediaResponse } from "../types"

/** Uploads files to the media library and reports problems as toasts. */
export function useMediaUpload(options?: {
  onUploaded?: (items: MediaItem[]) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const onUploaded = options?.onUploaded

  const upload = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      const rejected: string[] = []

      const accepted = files.filter((file) => {
        if (!isAllowedMimeType(file.type)) {
          rejected.push(`${file.name}: file type is not supported.`)
          return false
        }
        if (file.size > MEDIA_MAX_SIZE) {
          rejected.push(`${file.name}: file is larger than 10 MB.`)
          return false
        }
        return true
      })

      let items: MediaItem[] = []
      let errors = rejected

      if (accepted.length > 0) {
        setIsUploading(true)

        try {
          const body = new FormData()
          accepted.forEach((file) => body.append("files", file))

          const response = await fetch("/api/admin/media", {
            method: "POST",
            body,
          })
          const data =
            (await response.json()) as Partial<UploadMediaResponse> & {
              error?: string
            }

          items = data.items ?? []
          errors = [
            ...errors,
            ...(data.errors ?? []),
            ...(data.error ? [data.error] : []),
          ]
        } catch {
          errors = [...errors, "Upload failed. Check your connection."]
        } finally {
          setIsUploading(false)
        }
      }

      if (items.length > 0) {
        toast.add({
          type: "success",
          title:
            items.length === 1
              ? "File uploaded"
              : `${items.length} files uploaded`,
        })
        onUploaded?.(items)
      }

      if (errors.length > 0) {
        toast.add({
          type: "error",
          title: errors.length === 1 ? "Upload failed" : "Some uploads failed",
          description: errors.join("\n"),
        })
      }

      return items
    },
    [onUploaded]
  )

  return { upload, isUploading }
}
