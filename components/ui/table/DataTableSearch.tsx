// components/ui/table/DataTableSearch.tsx
"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import type { SortingState } from "@tanstack/react-table";

type DataTableSearchProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageSize?: number;
  buttons?: React.ReactNode[];
  totalPages?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange?: (sort: string, order: string) => void;
  searchValue: string;
  isLoading?: boolean;
};

export function DataTableSearch<TData>({
  columns,
  data,
  buttons,
  totalPages = 1,
  currentPage,
  onPageChange,
  onSearchChange,
  onSortChange,
  searchValue,
  isLoading = false,
}: DataTableSearchProps<TData>) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchValue) {
        onSearchChange(localSearch);
        // Reset to page 1 when searching
        if (currentPage !== 0) {
          onPageChange(0);
        }
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [localSearch, searchValue, currentPage, onSearchChange, onPageChange]);

  // Sync external search value changes
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Handle sorting changes
  useEffect(() => {
    if (sorting.length > 0 && onSortChange) {
      const sortField = sorting[0].id;
      const sortOrder = sorting[0].desc ? "desc" : "asc";
      onSortChange(sortField, sortOrder);
    }
  }, [sorting, onSortChange]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      {/* Search */}
      <div className="mb-4 flex justify-between items-center gap-4">
        {buttons &&
          buttons.map((button, index) => <div key={index}>{button}</div>)}
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={localSearch ?? ""}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.column.getSize() }}
                    className={`cursor-pointer whitespace-nowrap border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-100 `}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm text-gray-600">
          Page {currentPage + 1} of {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0 || isLoading}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1 || isLoading}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
