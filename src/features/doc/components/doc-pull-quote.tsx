import { cn } from "@/lib/utils"
import type { PullQuoteProps } from "@/components/pull-quote"
import { PullQuote } from "@/components/pull-quote"

export function DocPullQuote({ className, ...props }: PullQuoteProps) {
  return (
    <PullQuote className={cn("not-prose my-[2.5em]", className)} {...props} />
  )
}
