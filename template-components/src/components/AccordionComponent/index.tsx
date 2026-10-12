import type { LucideIcon } from "lucide-react"
import { type ReactNode, useId } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
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
  const generatedId = useId()
  const value = id ?? generatedId

  return (
    <Card
      data-slot="card-detail"
      className={cn("overflow-hidden py-0 shadow-sm ring-0", className)}
    >
      <Accordion
        defaultValue={defaultOpen ? [value] : []}
        multiple
        onValueChange={(open) => onOpenChange?.(open.includes(value))}
      >
        <AccordionItem
          value={value}
          className="group/section relative border-none"
        >
          {actions ? (
            <div className="absolute top-3.5 right-12 z-10 flex items-center gap-2">
              {actions}
            </div>
          ) : null}
          <AccordionTrigger className="rounded-none border-none px-4 py-5 hover:no-underline">
            <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-accordion-title uppercase">
              {Icon ? (
                <Icon className="size-4 shrink-0" aria-hidden="true" />
              ) : null}
              {title}
            </span>
          </AccordionTrigger>
          {titleDivider ? (
            // Same Separator and colour as the rows below; shown only while open.
            <Separator className="mx-4 bg-border-subtle opacity-0 transition-opacity duration-200 group-data-open/section:opacity-100 data-horizontal:w-auto" />
          ) : null}
          <AccordionContent className={cn("px-4 pb-4", contentClassName)}>
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
