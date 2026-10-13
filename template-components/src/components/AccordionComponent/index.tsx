import { ChevronDownIcon, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type AccordionComponentProps = {
  id?: string
  icon?: LucideIcon
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean

  titleDivider?: boolean
  /** Fires whenever the section opens or closes, for data loaded on expand. */
  onOpenChange?: (isOpen: boolean) => void
  actions?: ReactNode
  className?: string
  contentClassName?: string
}

/**
 * A collapsible section card: shadcn Card + Collapsible (one section, so no
 * Accordion). The whole header row toggles it.
 */
export function AccordionComponent({
  id,
  icon: Icon,
  title,
  children,
  defaultOpen = true,
  titleDivider = false,
  onOpenChange,
  actions,
  className,
  contentClassName,
}: AccordionComponentProps) {
  return (
    <Card
      id={id}
      data-slot="card-detail"
      className={cn(
        "gap-0 overflow-hidden rounded-card py-0 shadow-sm ring-0",
        className
      )}
    >
      <Collapsible defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <CardHeader className="group/section relative block px-0">
          {/* 56px with or without a button (up to 40px tall), centred; the
              trigger's ::after covers the row, so it all toggles. */}
          <div className="relative flex min-h-14 items-center gap-2 py-2 pr-5 pl-4">
            <CollapsibleTrigger className="flex min-w-0 flex-1 items-center text-left outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset">
              <CardTitle className="flex items-center gap-2.5 text-xs font-semibold tracking-normal text-accordion-title uppercase">
                {Icon ? (
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                ) : null}
                {title}
              </CardTitle>
            </CollapsibleTrigger>
            {actions ? (
              <div
                data-slot="section-actions"
                className="relative z-10 flex items-center gap-2"
              >
                {actions}
              </div>
            ) : null}
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none size-4 shrink-0 text-accordion-title transition-transform duration-200 group-has-data-panel-open/section:rotate-180"
            />
          </div>
          {titleDivider ? (
            // Same Separator, colour and inset (32px) as the DetailList rows below;
            // shown only while open. Absolute, so a closed section stays 56px.
            <Separator className="absolute inset-x-8 bottom-0 bg-border-subtle opacity-0 transition-opacity duration-200 group-has-data-panel-open/section:opacity-100 data-horizontal:w-auto" />
          ) : null}
        </CardHeader>
        <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
          <CardContent className={cn("px-4 pb-4", contentClassName)}>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
