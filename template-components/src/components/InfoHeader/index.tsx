import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { StatusBadge } from "@/components/StatusBadge"
import { cn } from "@/lib/utils"

/*
 * The dark page header, as composable parts (like shadcn's Card): each part is
 * layout and styling only - no data fetching, routing or translations - so any
 * micro-frontend can assemble the header it needs. A service-specific adapter
 * (e.g. DTH's ServiceInfoHeader) maps its data onto these parts.
 */

function InfoHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="info-header"
      className={cn(
        "relative min-h-35 rounded-xl bg-iris-bg-dark px-5 pt-4 pb-4 text-header-text",
        className
      )}
      {...props}
    />
  )
}

/** Top-right row: the status and any other header badges. */
function InfoHeaderAside({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-aside"
      className={cn("flex h-6 justify-end gap-2", className)}
      {...props}
    />
  )
}

/** The status pill shown in the aside. */
function InfoHeaderStatus({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <StatusBadge
      status={status}
      className={cn(
        "h-6 rounded-full px-2.5 font-medium shadow-sm [&>svg]:size-2",
        className
      )}
    />
  )
}

function InfoHeaderBreadcrumbs({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-breadcrumbs"
      className={cn("min-h-4", className)}
      {...props}
    />
  )
}

/** Bottom row: the identity on the left, alerts on the right. */
function InfoHeaderBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-body"
      className={cn("mt-3 flex items-end justify-between gap-3", className)}
      {...props}
    />
  )
}

/** Avatar and text, side by side. */
function InfoHeaderIdentity({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-identity"
      className={cn("flex min-w-0 items-center gap-3", className)}
      {...props}
    />
  )
}

/** Shows the first letter of `name`, or `children` when given instead. */
function InfoHeaderAvatar({
  name,
  className,
  children,
  ...props
}: ComponentProps<"span"> & { name?: string | null }) {
  return (
    <span
      data-slot="info-header-avatar"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-avatar text-base font-semibold text-avatar-foreground",
        className
      )}
      {...props}
    >
      {children ?? name?.trim().charAt(0).toUpperCase()}
    </span>
  )
}

/** Holds the title and subtitle; keeps its height while they load. */
function InfoHeaderText({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-text"
      className={cn("h-12 min-w-0", className)}
      {...props}
    />
  )
}

function InfoHeaderTitle({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="info-header-title"
      className={cn(
        "truncate text-lg font-semibold text-header-foreground",
        className
      )}
      {...props}
    />
  )
}

function InfoHeaderSubtitle({
  icon: Icon,
  className,
  children,
  ...props
}: ComponentProps<"p"> & { icon?: LucideIcon }) {
  return (
    <p
      data-slot="info-header-subtitle"
      className={cn(
        "flex items-center gap-1.5 text-sm text-header-foreground",
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{children}</span>
    </p>
  )
}

/** Right side of the body, e.g. the design's "active issue" pills. */
function InfoHeaderAlerts({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-alerts"
      className={cn("flex flex-col items-end gap-1", className)}
      {...props}
    />
  )
}

export {
  InfoHeader,
  InfoHeaderAlerts,
  InfoHeaderAside,
  InfoHeaderAvatar,
  InfoHeaderBody,
  InfoHeaderBreadcrumbs,
  InfoHeaderIdentity,
  InfoHeaderStatus,
  InfoHeaderSubtitle,
  InfoHeaderText,
  InfoHeaderTitle,
}
