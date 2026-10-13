import type { RowData } from "@tanstack/react-table"
import {
  columnSizingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from "@tanstack/react-table"
import type { ReactNode } from "react"

import type {
  DataColumnDef,
  DataTableColumnMeta,
} from "@/components/TableComponent/Table"
import { cn } from "@/lib/utils"

export const dataTableFeatures = tableFeatures({
  columnSizingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  columnMeta: {} as DataTableColumnMeta,
})

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === ""

const EMPTY_CELL = <span>-</span>

export const cellOf =
  <TData extends RowData>(
    render: ((text: string) => ReactNode) | null,
    value?: (row: TData) => unknown
  ) =>
  ({
    row,
    getValue,
  }: {
    row: { original: TData }
    getValue: () => unknown
  }) => {
    const raw = value ? value(row.original) : getValue()

    if (isEmpty(raw)) return EMPTY_CELL

    const text = String(raw)
    return render ? render(text) : text
  }

export const formattedCell = <TData extends RowData>(
  value: (row: TData) => unknown
) => cellOf<TData>(null, value)

/**
 * A value styled as a link (blue, underlined), e.g. an order number. Wrap the
 * column's cell in a real `Link` / `<a>` with `cellOf` when it navigates.
 */
export const linkCell = <TData extends RowData>(
  value?: (row: TData) => unknown
) =>
  cellOf<TData>(
    (text) => (
      <span className="font-semibold text-link underline underline-offset-3">
        {text}
      </span>
    ),
    value
  )

/** `meta` for a bold first column (model, name, id). */
export const strongCellMeta: DataTableColumnMeta = {
  cellClassName: "font-semibold",
}

const DEFAULT_COLUMN = {
  enableSorting: false,
  size: 120,
  sortDescFirst: false,
  sortUndefined: "last",
  sortFn: sortFn_alphanumeric,
  cell: ({ getValue }: { getValue: () => unknown }) => {
    const value = getValue()
    return isEmpty(value) ? EMPTY_CELL : String(value)
  },
}

export const defaultColumn = <TData extends RowData>() =>
  DEFAULT_COLUMN as unknown as Partial<DataColumnDef<TData>>

/** For rows without a stable id of their own. */
export const indexRowId = (_: unknown, index: number) => String(index)

export const headCellClass = (meta?: DataTableColumnMeta) =>
  cn(
    "h-8 px-2 py-2 align-top text-xs font-medium whitespace-normal",
    meta?.headClassName
  )

export const bodyCellClass = (meta?: DataTableColumnMeta) =>
  cn(
    "overflow-hidden px-2 py-3 align-middle text-xs wrap-break-word whitespace-normal",
    meta?.cellClassName
  )
