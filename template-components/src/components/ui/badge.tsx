import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-2xl border border-border px-2 py-0.5 text-xs font-semibold whitespace-nowrap [&>svg]:size-1.5 [&>svg]:shrink-0 [&>svg]:fill-current",
  {
    // The status guide's six tones; colours live in `index.css` (`--status-*`).
    variants: {
      tone: {
        success: "bg-status-success text-status-success-foreground",
        pending: "bg-status-pending text-status-pending-foreground",
        assigned: "bg-status-assigned text-status-assigned-foreground",
        info: "bg-status-info text-status-info-foreground",
        neutral: "bg-status-neutral text-status-neutral-foreground",
        error: "bg-status-error text-status-error-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
)

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      className={cn(badgeVariants({ tone, className }))}
      {...props}
    />
  )
}

function BadgeDot({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 8 8"
      aria-hidden="true"
      className={cn(className)}
      {...props}
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  )
}

export { Badge, BadgeDot, badgeVariants }
