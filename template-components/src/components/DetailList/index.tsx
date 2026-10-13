import type { ReactNode } from "react"
import type { To } from "react-router"

import { EmptyState } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { skeletonWidth } from "@/lib/skeleton"
import { cn } from "@/lib/utils"

import {
  DETAIL_GRID_CLASS,
  DETAIL_ROW_CLASS,
  DETAIL_TEXT_CLASS,
} from "./constants"
import { DetailValue } from "./DetailValue"

export type DetailRow = {
  id: string
  label: string
  value: ReactNode
  /** In-app link, rendered with react-router's `Link`. Keep it relative. */
  to?: To
  /** External link, opened in a new tab. */
  href?: string
  onSelect?: () => void
  /** Looks like a link but is not clickable yet. */
  underline?: boolean
  /** Trailing arrow, as on "see more" values. */
  arrow?: boolean
}

export type DetailListProps = {
  rows: DetailRow[]
  /** Shows a skeleton for every row; the labels stay visible. */
  isLoading?: boolean
  /** Rendered instead of the list when there is nothing to show. */
  emptyState?: ReactNode
  className?: string
}

/** The label/divider part of a row, shared by the data and skeleton states. */
const DetailRowShell = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div className={DETAIL_ROW_CLASS}>
    <Separator
      aria-hidden="true"
      className="absolute inset-x-0 top-0 bg-border-subtle"
    />
    <dt className={cn("shrink-0 text-label-foreground", DETAIL_TEXT_CLASS)}>
      {label}
    </dt>
    {children}
  </div>
)

/**
 * Label/value pairs in a two-column grid - a service's details, a customer
 * card, an order summary. Presentational only: the caller builds the rows, so
 * it fits any micro-frontend and any container (AccordionComponent, Card,
 * Dialog).
 */
export function DetailList({
  rows,
  isLoading = false,
  emptyState = <EmptyState />,
  className,
}: DetailListProps) {
  if (!isLoading && rows.length === 0) return <>{emptyState}</>

  return (
    <dl
      className={cn(DETAIL_GRID_CLASS, className)}
      aria-busy={isLoading || undefined}
    >
      {rows.map((row, index) => (
        <DetailRowShell key={row.id} label={row.label}>
          <dd
            className={cn(
              "min-w-0 text-right wrap-break-word",
              DETAIL_TEXT_CLASS
            )}
          >
            {isLoading ? (
              <Skeleton className={cn("ml-auto h-4", skeletonWidth(index))} />
            ) : (
              <DetailValue row={row} />
            )}
          </dd>
        </DetailRowShell>
      ))}
    </dl>
  )
}
