import type { ColumnDef, RowData } from "@tanstack/react-table"
import { useTable } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import type { ReactNode } from "react"

import { PageSizeSelect } from "@/components/Pagination/PageSizeSelect"
import { Pagination } from "@/components/Pagination/Pagination"
import {
  bodyCellClass,
  dataTableFeatures,
  defaultColumn,
  headCellClass,
} from "@/components/TableComponent/config"
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/components/TableComponent/constants"
import { TableSkeleton } from "@/components/TableComponent/TableSkeleton"
import { EmptyState } from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface DataTableColumnMeta {
  headClassName?: string
  cellClassName?: string
}

export type DataTableFeatures = typeof dataTableFeatures

export type DataColumnDef<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  unknown
>

export interface DataTableProps<TData extends RowData> {
  columns: Array<DataColumnDef<TData>>
  data: TData[]
  getRowId?: (originalRow: TData, index: number) => string
  isLoading?: boolean
  skeletonRows?: number
  /** Initial page size; shown in the select even if not in `pageSizeOptions`. */
  pageSize?: number
  pageSizeOptions?: number[]
  /** Shown instead of the table when there are no rows. */
  emptyState?: ReactNode
  className?: string
}

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const

export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  isLoading,
  skeletonRows,
  pageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  emptyState,
  className,
}: DataTableProps<TData>) {
  const table = useTable<DataTableFeatures, TData>({
    features: dataTableFeatures,
    defaultColumn: defaultColumn<TData>(),
    columns,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize } },
    getRowId,
  })

  const rows = table.getRowModel().rows
  const { pageIndex, pageSize: currentPageSize } = table.state.pagination

  // Every size the select offers, including a custom initial one.
  const sizes = [...new Set([pageSize, ...pageSizeOptions])].sort(
    (a, b) => a - b
  )
  // Below the smallest size there is nothing to page through.
  const isPaginated = table.getRowCount() > sizes[0]

  if (isLoading) {
    return (
      <div className={cn("flex min-h-0 w-full min-w-0 flex-col", className)}>
        <TableSkeleton columns={columns} rows={skeletonRows} />
      </div>
    )
  }

  if (data.length === 0) {
    return <div className={className}>{emptyState ?? <EmptyState />}</div>
  }

  return (
    <div className={cn("flex min-h-0 w-full min-w-0 flex-col", className)}>
      <Table
        className="w-full table-fixed"
        style={{ minWidth: table.getCenterTotalSize() }}
      >
        <TableHeader className="border-border-subtle bg-table-header [&_tr]:border-t-border-subtle">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta
                const sortDirection = header.column.getIsSorted()
                const canSort = header.column.getCanSort()

                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={headCellClass(meta)}
                    aria-sort={
                      canSort
                        ? sortDirection
                          ? ARIA_SORT[sortDirection]
                          : "none"
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <table.FlexRender header={header} />
                        {sortDirection === "asc" ? (
                          <ArrowUp className="size-4 shrink-0" />
                        ) : sortDirection === "desc" ? (
                          <ArrowDown className="size-4 shrink-0" />
                        ) : (
                          <ArrowUpDown className="size-4 shrink-0 text-muted-foreground/50" />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/50">
              {row.getAllCells().map((cell) => {
                const meta = cell.column.columnDef.meta

                return (
                  <TableCell key={cell.id} className={bodyCellClass(meta)}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isPaginated ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-8 px-2">
          <PageSizeSelect
            options={sizes}
            value={currentPageSize}
            onChange={(size) => table.setPageSize(size)}
          />
          <Pagination
            page={pageIndex + 1}
            totalPages={Math.max(table.getPageCount(), 1)}
            onPageChange={(next) => table.setPageIndex(next - 1)}
          />
        </div>
      ) : null}
    </div>
  )
}
