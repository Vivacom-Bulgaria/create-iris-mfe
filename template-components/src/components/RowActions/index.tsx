import { MoreVertical } from "lucide-react"
import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { i18nNamespace } from "@/i18n"
import { cn } from "@/lib/utils"

/*
 * The "actions" cell of a table row: stacked buttons plus a ⋮ menu. The menu
 * items are plain shadcn DropdownMenu parts; RowActionsMenuContent only gives
 * them the design's spacing.
 *
 *   <RowActions>
 *     <RowActionButtons>
 *       <RowActionButton onClick={authorize}>{t("authorize")}</RowActionButton>
 *     </RowActionButtons>
 *     <DropdownMenu>
 *       <RowActionsTrigger disabled={inactive} />
 *       <RowActionsMenuContent>
 *         <DropdownMenuItem onClick={openHistory}>{t("history")}</DropdownMenuItem>
 *         <DropdownMenuSeparator />
 *         <DropdownMenuItem render={<a href={url} target="_blank" />}>
 *           {t("manual")}
 *           <DropdownMenuShortcut><ExternalLink /></DropdownMenuShortcut>
 *         </DropdownMenuItem>
 *       </RowActionsMenuContent>
 *     </DropdownMenu>
 *   </RowActions>
 */

export function RowActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="row-actions"
      className={cn("flex items-start justify-end", className)}
      {...props}
    />
  )
}

export function RowActionButtons({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="row-action-buttons"
      className={cn("flex flex-col items-end gap-1", className)}
      {...props}
    />
  )
}

/**
 * A grey pill; a long label wraps onto a second line. Disabled keeps the
 * lighter `secondary` fill, so it reads as inactive rather than as a faded
 * darker grey.
 */
export function RowActionButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn(
        "h-auto min-h-8 rounded-full bg-border px-2 py-1 text-center text-xs leading-4 font-normal whitespace-normal hover:bg-[color-mix(in_oklch,var(--border),var(--foreground)_6%)] disabled:bg-secondary",
        className
      )}
      {...props}
    />
  )
}

/** The round ⋮ button that opens the DropdownMenu; children replace the icon. */
export function RowActionsTrigger({
  className,
  children = <MoreVertical />,
  ...props
}: ComponentProps<typeof DropdownMenuTrigger>) {
  const { t } = useTranslation(i18nNamespace)

  return (
    <DropdownMenuTrigger
      aria-label={t("ui.rowActions.more")}
      render={
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-9 rounded-md data-popup-open:bg-muted",
            className
          )}
        />
      }
      {...props}
    >
      {children}
    </DropdownMenuTrigger>
  )
}

/**
 * shadcn's DropdownMenuContent with the design's roomier items and a flush
 * separator. An icon after the text sits at the right edge, muted:
 * `<DropdownMenuItem render={<a href={url} target="_blank" />}>Виж инструкция<ExternalLink /></DropdownMenuItem>`.
 */
export function RowActionsMenuContent({
  align = "end",
  className,
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      align={align}
      className={cn(
        "w-auto min-w-60 py-0 **:data-[slot=dropdown-menu-item]:px-3 **:data-[slot=dropdown-menu-item]:py-2.5 **:data-[slot=dropdown-menu-separator]:my-0 **:data-[slot=dropdown-menu-shortcut]:text-muted-foreground/70 [&_[data-slot=dropdown-menu-item]>svg:last-child:not(:first-child)]:ml-auto [&_[data-slot=dropdown-menu-item]>svg:last-child:not(:first-child)]:text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}
