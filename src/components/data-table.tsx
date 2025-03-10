"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // ✅ Store pagination state externally
  const [pageIndex, setPageIndex] = React.useState(0);
  const pageSize = 5; // Fixed page size of 5 rows per page

  // ✅ Memoize full data to prevent unnecessary resets
  const memoizedData = useMemo(() => data, [data]);

  // ✅ Slice data for pagination
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return memoizedData.slice(start, start + pageSize);
  }, [memoizedData, pageIndex]);

  // ✅ Ensure pageIndex is valid after data changes
  useEffect(() => {
    if (pageIndex > Math.floor(memoizedData.length / pageSize)) {
      setPageIndex(0);
    }
  }, [memoizedData, pageIndex]);

  const table = useReactTable({
    data: paginatedData, // ✅ Only use sliced paginated data
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      {/* Search Filter */}
      <div className="flex items-center justify-between pb-4">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("categoryName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("categoryName")?.setFilterValue(event.target.value)
          }
          className="max-w-52 text-white placeholder:text-indigo-200 bg-indigo-800/70 font-semibold border border-indigo-600"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto bg-indigo-800/70 border border-indigo-600 text-indigo-200 hover:bg-indigo-700 hover:text-indigo-200"
            >
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-xl">
        <Table className="bg-gradient-to-br from-purple-950 to-indigo-900 text-indigo rounded-xl">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className=" border-indigo-300 border-r border-b last:border-r-0  rounded-xl text-[16px] font-bold text-indigo-400"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-transparent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-indigo-300 border border-l-0 last:border-r-0 border-b-0 rounded-xl text-indigo-200 capitalize"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className="font-semibold bg-indigo-700 hover:bg-indigo-600 text-indigo-300 hover:text-indigo-300 border border-indigo-600 hover:border-indigo-500"
        >
          Previous
        </Button>
        <span className="text-white">
          Page {pageIndex + 1} of {Math.ceil(memoizedData.length / pageSize)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => prev + 1)}
          disabled={(pageIndex + 1) * pageSize >= memoizedData.length}
          className="font-semibold bg-indigo-700 hover:bg-indigo-600 text-indigo-300 hover:text-indigo-300 border border-indigo-600 hover:border-indigo-500"
        >
          Next
        </Button>
      </div>
    </>
  );
}
