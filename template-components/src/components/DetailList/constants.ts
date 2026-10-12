/** Two columns from `sm` up; the first row of each column has no top divider. */
export const DETAIL_GRID_CLASS =
  "grid gap-x-10 sm:grid-cols-2 [&>*:first-child>[data-slot=separator]]:hidden sm:[&>*:nth-child(2)>[data-slot=separator]]:hidden"

export const DETAIL_ROW_CLASS =
  "relative flex items-baseline justify-between gap-6 px-3 pt-5 pb-2"

export const INTERACTIVE_VALUE_CLASS =
  "inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
