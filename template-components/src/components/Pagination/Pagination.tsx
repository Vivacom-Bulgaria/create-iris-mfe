import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { i18nNamespace } from "@/i18n"

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
  const { t } = useTranslation(i18nNamespace)

  // shadcn's nav > ul > li structure; its Previous/Next links are not used -
  // they are <a href> with English text, and these are buttons.
  return (
    <PaginationRoot
      aria-label={t("ui.pagination.navigation")}
      className="mx-0 w-auto items-center gap-12"
    >
      <span className="text-sm font-medium text-foreground">
        {t("ui.pagination.currentPage", { page, totalPages })}
      </span>

      <PaginationContent className="gap-2">
        {PAGE_BUTTONS.map(({ icon: Icon, label, target }) => {
          const next = target(page, totalPages)

          return (
            <PaginationItem key={label}>
              <Button
                variant="outline"
                size="icon"
                className="shadow-xs"
                disabled={next < 1 || next > totalPages || next === page}
                onClick={() => onPageChange(next)}
                aria-label={t(`ui.pagination.${label}`)}
              >
                <Icon />
              </Button>
            </PaginationItem>
          )
        })}
      </PaginationContent>
    </PaginationRoot>
  )
}
