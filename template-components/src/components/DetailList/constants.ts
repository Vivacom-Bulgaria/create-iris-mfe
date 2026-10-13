/**
 * Two columns from `sm` up, inset so labels and dividers share one edge; the
 * first row of each column has no top divider.
 */
export const DETAIL_GRID_CLASS =
  "grid gap-x-13 px-4 pt-1.5 pb-1.5 sm:grid-cols-2 [&>*:first-child>[data-slot=separator]]:hidden sm:[&>*:nth-child(2)>[data-slot=separator]]:hidden"

export const DETAIL_ROW_CLASS =
  "relative flex items-baseline justify-between gap-6 pt-5 pb-2"

/** Label and value text (12px) on an 18px line (leading-4.5): the design's 46px rows. */
export const DETAIL_TEXT_CLASS = "text-xs leading-4.5"

export const INTERACTIVE_VALUE_CLASS =
  "inline-flex items-center gap-1.5 font-medium text-value-foreground underline underline-offset-3 transition-colors hover:text-primary"
