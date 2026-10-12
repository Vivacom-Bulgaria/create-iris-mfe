import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { uiNamespace } from "@/lib/ui-i18n"
import { cn } from "@/lib/utils"

/*
 * shadcn's Dialog, laid out like its "Sticky Footer" / "Scrollable Content"
 * examples: the header and footer stay put, the body scrolls between them.
 *
 *   <Modal>
 *     <ModalTrigger render={<Button />}>...</ModalTrigger>
 *     <ModalContent size="md">
 *       <ModalHeader><ModalTitle>...</ModalTitle></ModalHeader>
 *       <ModalBody>...</ModalBody>
 *       <ModalFooter><ModalClose>...</ModalClose></ModalFooter>
 *     </ModalContent>
 *   </Modal>
 */

export const Modal = Dialog

export const ModalTrigger = DialogTrigger

const modalContentVariants = cva("flex max-h-[calc(100svh-2rem)] flex-col", {
  variants: {
    size: {
      sm: "sm:max-w-lg",
      md: "sm:max-w-3xl",
      lg: "sm:max-w-5xl",
      xl: "sm:max-w-7xl",
      full: "sm:max-w-[calc(100%-2rem)]",
      /** As wide as the content. */
      auto: "w-fit sm:max-w-[calc(100%-2rem)]",
    },
  },
  defaultVariants: { size: "md" },
})

export type ModalSize = NonNullable<
  VariantProps<typeof modalContentVariants>["size"]
>

/**
 * shadcn's DialogContent with its own × turned off: that one has a hardcoded
 * English label, this one takes it from the `iris-ui` translations.
 */
export function ModalContent({
  size,
  showCloseButton = true,
  className,
  children,
  ...props
}: ComponentProps<typeof DialogContent> &
  VariantProps<typeof modalContentVariants>) {
  const { t } = useTranslation(uiNamespace)

  return (
    <DialogContent
      showCloseButton={false}
      className={cn(modalContentVariants({ size }), className)}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogClose
          aria-label={t("modal.close")}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-2"
            />
          }
        >
          <XIcon />
        </DialogClose>
      ) : null}
    </DialogContent>
  )
}

export const ModalHeader = DialogHeader

/** Put an icon before the text as a child: `<ModalTitle><Tv />Канали</ModalTitle>`. */
export function ModalTitle({
  className,
  ...props
}: ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn(
        "flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export const ModalDescription = DialogDescription

/** The part that scrolls; full width, so the scrollbar sits at the edge. */
export function ModalBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn(
        "-mx-4 scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4",
        className
      )}
      {...props}
    />
  )
}

export const ModalFooter = DialogFooter

/**
 * A button that only closes: `<ModalClose>Отказ</ModalClose>`.
 * `render` swaps the button, e.g. `render={<Button variant="info" />}`.
 */
export function ModalClose({
  render = <Button variant="outline" />,
  ...props
}: ComponentProps<typeof DialogClose>) {
  return <DialogClose render={render} {...props} />
}
