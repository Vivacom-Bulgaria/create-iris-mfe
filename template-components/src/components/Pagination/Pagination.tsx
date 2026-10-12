import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { uiNamespace } from "@/lib/ui-i18n"

type PageButton = {
  icon: LucideIcon
  label: "firstPage" | "previousPage" | "nextPage" | "lastPage"
  target: (page: number, totalPages: number) => number
}

const PAGE_BUTTONS: PageButton[] = [
  { icon: ChevronsLeft, label: "firstPage", target: () => 1 },
  { icon: ChevronLeft, label: "previousPage", target: (page) => page - 1 },
  { icon: ChevronRight, label: "nextPage", target: (page) => page + 1 },
  { icon: ChevronsRight, label: "lastPage", target: (_, total) => total },
]

/** 1-based page navigation: first / previous / next / last. */
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation(uiNamespace)

  return (
    <nav
      className="flex items-center gap-2"
      aria-label={t("pagination.navigation")}
    >
      <span className="mr-4 text-sm font-semibold text-foreground">
        {t("pagination.currentPage", { page, totalPages })}
      </span>

      {PAGE_BUTTONS.map(({ icon: Icon, label, target }) => {
        const next = target(page, totalPages)

        return (
          <Button
            key={label}
            variant="outline"
            size="icon"
            disabled={next < 1 || next > totalPages || next === page}
            onClick={() => onPageChange(next)}
            aria-label={t(`pagination.${label}`)}
          >
            <Icon />
          </Button>
        )
      })}
    </nav>
  )
}
