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
import { i18nNamespace } from "@/i18n"
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

// Base look from the design, shared by every modal: a soft shadow instead of
// the ring, a bit more room on top.
const modalContentVariants = cva(
  "flex max-h-[calc(100svh-2rem)] flex-col pt-5 shadow-lg ring-0",
  {
    variants: {
      size: {
        sm: "sm:max-w-lg",
        md: "sm:max-w-[50rem]",
        lg: "sm:max-w-5xl",
        xl: "sm:max-w-7xl",
        full: "sm:max-w-[calc(100%-2rem)]",
        /** As wide as the content. */
        auto: "w-fit sm:max-w-[calc(100%-2rem)]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export type ModalSize = NonNullable<
  VariantProps<typeof modalContentVariants>["size"]
>

/**
 * shadcn's DialogContent with its own × turned off: that one has a hardcoded
 * English label, this one takes it from `ui.modal.close` in src/lang.
 */
export function ModalContent({
  size,
  showCloseButton = true,
  className,
  children,
  ...props
}: ComponentProps<typeof DialogContent> &
  VariantProps<typeof modalContentVariants>) {
  const { t } = useTranslation(i18nNamespace)

  return (
    <DialogContent
      showCloseButton={false}
      className={cn(modalContentVariants({ size }), className)}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogClose
          aria-label={t("ui.modal.close")}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-4 right-4 text-muted-foreground"
            />
          }
        >
          <XIcon />
        </DialogClose>
      ) : null}
    </DialogContent>
  )
}

/** pr-8 keeps the title clear of the close icon. */
export function ModalHeader({
  className,
  ...props
}: ComponentProps<typeof DialogHeader>) {
  return <DialogHeader className={cn("pr-8", className)} {...props} />
}

const modalTitleVariants = cva(
  "flex items-center gap-2 font-semibold [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "text-base [&_svg]:size-4",
        md: "text-lg [&_svg]:size-4",
        /** The design's default. */
        lg: "text-xl [&_svg]:size-5",
      },
    },
    defaultVariants: { size: "lg" },
  }
)

/**
 * Optional: a modal without a visible title either keeps one for screen
 * readers (`visuallyHidden`) or names itself with `aria-label` on ModalContent.
 * An icon goes before the text as a child: `<ModalTitle><Tv />Канали</ModalTitle>`.
 */
export function ModalTitle({
  size,
  visuallyHidden = false,
  className,
  ...props
}: ComponentProps<typeof DialogTitle> &
  VariantProps<typeof modalTitleVariants> & { visuallyHidden?: boolean }) {
  return (
    <DialogTitle
      className={cn(
        modalTitleVariants({ size }),
        visuallyHidden && "sr-only",
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

/** shadcn's DialogFooter without its bar: the design has no fill or border. */
export function ModalFooter({
  className,
  ...props
}: ComponentProps<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn("border-t-0 bg-transparent pt-6", className)}
      {...props}
    />
  )
}

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
