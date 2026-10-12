import { Fragment } from "react"
import { Link, type To } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export type Crumb = {
  id: string
  label: string
  /** Omitted for the current page, which renders as plain text. */
  to?: To
}

/**
 * Breadcrumbs styled for the dark page header. Presentational only: the caller
 * builds the trail, so any micro-frontend can use it with its own routes.
 */
export const Breadcrumbs = ({
  crumbs,
  className,
}: {
  crumbs: Crumb[]
  className?: string
}) => (
  <Breadcrumb className={cn("min-w-0", className)}>
    <BreadcrumbList className="text-xs text-header-muted">
      {crumbs.map((crumb, index) => (
        <Fragment key={crumb.id}>
          {index > 0 ? (
            <BreadcrumbSeparator className="text-header-subtle" />
          ) : null}
          <BreadcrumbItem className="min-w-0">
            {crumb.to ? (
              <BreadcrumbLink
                className="truncate hover:text-header-text"
                render={<Link to={crumb.to} />}
              >
                {crumb.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="truncate text-header-foreground">
                {crumb.label}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
)
