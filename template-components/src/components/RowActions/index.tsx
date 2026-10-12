import { MoreVertical } from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { uiNamespace } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

/*
 * The "actions" cell of a table row: stacked buttons plus a ⋮ menu. The menu
 * is plain shadcn DropdownMenu - only the round ⋮ trigger is ours.
 *
 */

export function RowActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="row-actions"
      className={cn("flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}

export function RowActionButtons({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="row-action-buttons"
      className={cn("flex flex-col items-end gap-1.5", className)}
      {...props}
    />
  );
}

export function RowActionButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn("rounded-full px-3", className)}
      {...props}
    />
  );
}

/** The round ⋮ button that opens the DropdownMenu; children replace the icon. */
export function RowActionsTrigger({
  className,
  children = <MoreVertical />,
  ...props
}: ComponentProps<typeof DropdownMenuTrigger>) {
  const { t } = useTranslation(uiNamespace);

  return (
    <DropdownMenuTrigger
      aria-label={t("rowActions.more")}
      render={
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-9 rounded-full data-popup-open:bg-muted",
            className,
          )}
        />
      }
      {...props}
    >
      {children}
    </DropdownMenuTrigger>
  );
}
