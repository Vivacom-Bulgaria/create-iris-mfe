import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"

import { uiNamespace } from "@/lib/ui-i18n"
import { cn } from "@/lib/utils"

/** "No data" by default (`iris-ui` translation); pass children for any other message. */
export const EmptyState = ({
  className,
  children,
  ...props
}: ComponentProps<"p">) => {
  const { t } = useTranslation(uiNamespace)

  return (
    <p
      className={cn("py-3 text-sm text-muted-foreground", className)}
      {...props}
    >
      {children ?? t("emptyState.noData")}
    </p>
  )
}
