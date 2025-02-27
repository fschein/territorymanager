"use client";

import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
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
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa6";

// interface DataTableProps<TData, TValue> {
//   sumField?: string;
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   rowCount: number;
//   showRowCount?: boolean;
//   pagination?: PaginationState;
//   setPagination?: (pagination: PaginationState) => void;
//   rowSelection?: RowSelectionState;
//   handleRowSelection?: (data: any) => void;
//   isLoading?: boolean;
//   variant?: "default" | "secondary";
//   fixed?: boolean;
//   maxHeight?: this["fixed"] extends true ? number : never;
// }

interface DataTableBaseProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
  showRowCount?: boolean;
  pagination?: PaginationState;
  setPagination?: (pagination: PaginationState) => void;
  rowSelection?: RowSelectionState;
  handleRowSelection?: (data: any) => void;
  isLoading?: boolean;
  variant?: "default" | "secondary";
}

interface DataTableFixedProps<TData, TValue> extends DataTableBaseProps<TData, TValue> {
  fixed: true;
  maxHeight: number; // Obrigatório quando `fixed` é `true`
}

interface DataTableNonFixedProps<TData, TValue> extends DataTableBaseProps<TData, TValue> {
  fixed?: false;
  maxHeight?: number; // Opcional quando `fixed` é `false` ou não está presente
}

type DataTableProps<TData, TValue> =
  | DataTableFixedProps<TData, TValue>
  | DataTableNonFixedProps<TData, TValue>;

export function DataTable<TData, TValue>({
  pagination,
  setPagination,
  columns,
  data,
  rowCount,
  showRowCount,
  rowSelection,
  handleRowSelection,
  isLoading,
  variant = "default",
  fixed,
  maxHeight,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    rowCount: rowCount || 0,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      rowSelection: rowSelection || {},
    },
    onPaginationChange: (callback) => {
      // @ts-expect-error ignorado
      const result = callback(pagination);
      if (setPagination) {
        setPagination(result);
      }
      if (handleRowSelection) {
        handleRowSelection({
          rowSelection: {},
          idSelection: [],
        });
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: (callback) => {
      // @ts-expect-error ignorado
      const result = callback(rowSelection);
      if (handleRowSelection) {
        const ids = Object.keys(result).map(
          // @ts-expect-error ignorado
          (c) => data[c].id
        );
        handleRowSelection({
          rowSelection: result,
          idSelection: ids,
        });
      }
    },
    manualPagination: true,
  });

  //^ Volta para o início ao filtrar
  useEffect(() => {
    table.setPageIndex(0);
  }, [table.getPageCount()]);

  //^ Foi adicionada a class scroll-thin no componente de Table

  return (
    <div className="rounded-md border">
      <Table
        divClassname={
          fixed ? `overflow-auto scroll-thin max-h-[${maxHeight}vh] border rounded-md` : ""
        }
      >
        <TableHeader
          className={`${variant === "secondary" && "bg-secondary"} ${
            fixed && "sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md"
          }`}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    onClick={() => header.column.toggleSorting()}
                    className="text-nowrap cursor-pointer text-xs"
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {/* Se for do tipo id não reenderiza os ícones */}
                        {header.column.getCanSort() &&
                          header.column.getIsSorted() === "asc" &&
                          " 🔼"}
                        {header.column.getCanSort() &&
                          header.column.getIsSorted() === "desc" &&
                          " 🔽"}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="scroll-thin">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={
                  variant === "secondary" ? "odd:bg-secondary/60 even:bg-secondary/40" : ""
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              {isLoading ? (
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <span className="flex gap-2 w-full items-center justify-center">
                    <FaSpinner size={18} className="me-2 animate-spin" /> Carregando...
                  </span>
                </TableCell>
              ) : (
                <TableCell colSpan={columns.length} className="h-24 text-center"></TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex items-center justify-between py-2 px-3">
        <div
          className={`flex-1 text-xs sm:text-sm text-muted-foreground ${
            !handleRowSelection && "hidden"
          }`}
        >
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} selecionado(s).{" "}
        </div>

        <div
          className={`flex flex-row gap-3 items-center ${
            !handleRowSelection && "w-full justify-between"
          } sm:space-x-6 lg:space-x-8`}
        >
          <div className="flex items-center space-x-0 sm:space-x-2">
            <p className="text-xs sm:text-sm font-medium hidden sm:inline-block">
              Linhas por página
            </p>
            <Select
              value={`${table.getState().pagination.pageSize?.toString() || ""}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 text-xs sm:text-sm w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 30, 40, 50, 100, 200, 300].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            className={`flex-1 text-xs sm:text-sm text-muted-foreground ${
              !showRowCount && "hidden"
            }`}
          >
            Total: {rowCount}
          </div>
          <div className="flex items-center justify-center text-xs sm:text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <span className="sr-only">Vá para a primeira</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <span className="sr-only">Próxima</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <span className="sr-only">Vá para a última página</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
