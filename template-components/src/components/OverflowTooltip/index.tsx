import { type ComponentProps, useRef, useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Everything that styles the tooltip itself is passed through: colour
 * (`variant`, or `className` / `style` with --tooltip-bg / --tooltip-fg), the
 * arrow (`side`, `align`, `showArrow`, `arrowClassName`) and `sideOffset`.
 */
export type OverflowTooltipProps = { children: string } & Pick<
  ComponentProps<typeof TooltipContent>,
  | "variant"
  | "side"
  | "align"
  | "sideOffset"
  | "showArrow"
  | "arrowClassName"
  | "className"
  | "style"
>

/**
 * Truncates the text and shows it in full in a tooltip - only when it is
 * actually cut off. Overflow is checked at the moment the tooltip would open,
 * so resizes, text changes and late-loading fonts need no observer.
 */
export function OverflowTooltip({
  children,
  ...contentProps
}: OverflowTooltipProps) {
  const contentRef = useRef<HTMLSpanElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    const element = contentRef.current
    setIsOpen(
      open && element !== null && element.scrollWidth > element.clientWidth
    )
  }

  return (
    <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipTrigger
        render={<span ref={contentRef} className="block min-w-0 truncate" />}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent {...contentProps}>{children}</TooltipContent>
    </Tooltip>
  )
}
