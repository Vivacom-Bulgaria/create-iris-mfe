import { type ComponentProps, Fragment } from "react"
import { useTranslation } from "react-i18next"
import { Link, type To } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { uiNamespace } from "@/lib/ui-i18n"
import { cn } from "@/lib/utils"

export type Crumb = {
  id: string
  label: string
  /** Omitted for the current page, which renders as plain text. */
  to?: To
}

/**
 * Breadcrumbs styled for the dark page header. Presentational only: the caller
 * builds the trail (labels already translated), so any micro-frontend can use
 * it with its own routes. The <nav> label defaults to the `iris-ui`
 * translation; pass `aria-label` to override it.
 */
export const Breadcrumbs = ({
  crumbs,
  className,
  ...props
}: ComponentProps<typeof Breadcrumb> & { crumbs: Crumb[] }) => {
  const { t } = useTranslation(uiNamespace)

  return (
    <Breadcrumb
      aria-label={t("breadcrumbs.label")}
      className={cn("min-w-0", className)}
      {...props}
    >
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
}
