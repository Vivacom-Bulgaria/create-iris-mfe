import type { RowData } from "@tanstack/react-table"

import {
  bodyCellClass,
  headCellClass,
} from "@/components/TableComponent/config"
import { DEFAULT_SKELETON_ROWS } from "@/components/TableComponent/constants"
import type { DataColumnDef } from "@/components/TableComponent/Table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { skeletonWidth } from "@/lib/skeleton"
import { cn } from "@/lib/utils"

export type TableSkeletonProps<TData extends RowData> = {
  columns: Array<DataColumnDef<TData>>
  rows?: number
}

export function TableSkeleton<TData extends RowData>({
  columns,
  rows = DEFAULT_SKELETON_ROWS,
}: TableSkeletonProps<TData>) {
  const totalSize = columns.reduce((sum, column) => sum + (column.size ?? 0), 0)

  return (
    <div className="w-full" aria-busy="true">
      <Table className="w-full table-fixed" style={{ minWidth: totalSize }}>
        <TableHeader className="border-border-subtle bg-table-header [&_tr]:border-t-border-subtle">
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                key={column.id ?? index}
                style={{ width: column.size }}
                className={headCellClass(column.meta)}
              >
                {typeof column.header === "string" ? column.header : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-transparent">
              {columns.map((column, columnIndex) => (
                <TableCell
                  key={column.id ?? columnIndex}
                  className={bodyCellClass(column.meta)}
                >
                  <Skeleton
                    className={cn(
                      "h-4 max-w-full",
                      skeletonWidth(columnIndex + rowIndex)
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
