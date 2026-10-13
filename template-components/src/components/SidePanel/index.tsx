import { XIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { i18nNamespace } from "@/i18n"
import { cn } from "@/lib/utils"

/*
 * A panel stuck to an edge of the screen - shadcn's Base UI Drawer: swipe to
 * close, `modal={false}` for a non-modal panel, nested panels.
 *
 *   <SidePanel side="right">
 *     <SidePanelTrigger render={<Button />}>...</SidePanelTrigger>
 *     <SidePanelContent size="half">
 *       <SidePanelHeader><SidePanelTitle>...</SidePanelTitle></SidePanelHeader>
 *       <SidePanelBody>...</SidePanelBody>
 *       <SidePanelFooter>...</SidePanelFooter>
 *     </SidePanelContent>
 *   </SidePanel>
 */

const SWIPE_DIRECTION = {
  right: "right",
  left: "left",
  top: "up",
  bottom: "down",
} as const

export type SidePanelSide = keyof typeof SWIPE_DIRECTION

/** `side` is the edge the panel is stuck to; every Drawer prop applies. */
export function SidePanel({
  side = "right",
  ...props
}: Omit<ComponentProps<typeof Drawer>, "swipeDirection"> & {
  side?: SidePanelSide
}) {
  return <Drawer swipeDirection={SWIPE_DIRECTION[side]} {...props} />
}

export const SidePanelTrigger = DrawerTrigger

// Widths for left/right panels. Same variant prefix as shadcn's drawer.tsx,
// so tailwind-merge replaces its 24rem default.
const SIZE_CLASS = {
  sm: "data-[swipe-axis=x]:sm:[--drawer-content-width:30rem]",
  md: "data-[swipe-axis=x]:sm:[--drawer-content-width:48rem]",
  lg: "data-[swipe-axis=x]:sm:[--drawer-content-width:64rem]",
  half: "data-[swipe-axis=x]:sm:[--drawer-content-width:50%]",
  full: "data-[swipe-axis=x]:sm:[--drawer-content-width:100%]",
} as const

export type SidePanelSize = keyof typeof SIZE_CLASS

export function SidePanelContent({
  size = "sm",
  showCloseButton = true,
  className,
  children,
  ...props
}: ComponentProps<typeof DrawerContent> & {
  size?: SidePanelSize
  showCloseButton?: boolean
}) {
  const { t } = useTranslation(i18nNamespace)

  return (
    <DrawerContent
      className={cn(
        // Flush with the edge: no radius, no border (the design has neither).
        "shadow-lg data-[swipe-direction=down]:rounded-none data-[swipe-direction=down]:border-0 data-[swipe-direction=left]:rounded-none data-[swipe-direction=left]:border-0 data-[swipe-direction=right]:rounded-none data-[swipe-direction=right]:border-0 data-[swipe-direction=up]:rounded-none data-[swipe-direction=up]:border-0",
        SIZE_CLASS[size],
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DrawerClose
          aria-label={t("ui.modal.close")}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3.5 right-2.5"
            />
          }
        >
          <XIcon />
        </DrawerClose>
      ) : null}
    </DrawerContent>
  )
}

export function SidePanelHeader({
  className,
  ...props
}: ComponentProps<typeof DrawerHeader>) {
  // pr-12 keeps the title clear of the close icon.
  return (
    <DrawerHeader
      className={cn("pr-12 pb-4 text-left", className)}
      {...props}
    />
  )
}

/** Put an icon before the text as a child. */
export function SidePanelTitle({
  className,
  ...props
}: ComponentProps<typeof DrawerTitle>) {
  return (
    <DrawerTitle
      className={cn(
        "flex items-center gap-2 text-xl leading-6 [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export const SidePanelDescription = DrawerDescription

/** The part that scrolls between the header and the footer; blocks 20px apart. */
export function SidePanelBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="side-panel-body"
      className={cn(
        "flex scrollbar-thin min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5",
        className
      )}
      {...props}
    />
  )
}

export function SidePanelFooter({
  className,
  ...props
}: ComponentProps<typeof DrawerFooter>) {
  return (
    <DrawerFooter
      className={cn("pt-4 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

/** A button that only closes the panel; `render` swaps the button. */
export function SidePanelClose({
  render = <Button variant="outline" />,
  ...props
}: ComponentProps<typeof DrawerClose>) {
  return <DrawerClose render={render} {...props} />
}
