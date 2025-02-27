"use client";

import type React from "react";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { FilterPopover, FilterValue } from "../filter_popover";
import { getCommonPinningStyles } from "@/lib/utils";

export interface Column<T> {
  accessor: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  queryKey: string;
  fetchData: (params: {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filters?: Record<string, FilterValue>;
  }) => Promise<{
    items: T[];
    total: number;
    hasMore: boolean;
  }>;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  queryKey,
  fetchData,
  actions,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [tempFilters, setTempFilters] = useState<Record<string, FilterValue>>(
    {}
  );

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [queryKey, page, pageSize, sortBy, sortOrder, filters],
    queryFn: () => fetchData({ page, pageSize, sortBy, sortOrder, filters }),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleTempFilterChange = (column: string, value: FilterValue) => {
    setTempFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const applyFilter = (column: string) => {
    const tempFilter = tempFilters[column];
    if (
      tempFilter &&
      (tempFilter.value1 ||
        tempFilter.value2 ||
        ["blank", "notBlank"].includes(tempFilter.type1) ||
        ["blank", "notBlank"].includes(tempFilter.type2))
    ) {
      setFilters((prev) => ({
        ...prev,
        [column]: tempFilter,
      }));
      setPage(1);
    } else {
      removeFilter(column);
    }
  };

  const removeFilter = (column: string) => {
    const { [column]: _, ...restFilters } = filters;
    setFilters(restFilters);
    const { [column]: __, ...restTempFilters } = tempFilters;
    setTempFilters(restTempFilters);
    setPage(1);
  };

  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessor as string}>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        column.sortable && handleSort(column.accessor as string)
                      }
                      className="flex items-center"
                    >
                      {column.header}
                      {sortBy === column.accessor &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Filter
                            className={`h-4 w-4 ${
                              filters[column.accessor as string]
                                ? "text-primary"
                                : ""
                            }`}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <FilterPopover
                          value={
                            tempFilters[column.accessor as string] || {
                              type1: "contains",
                              value1: "",
                              operator: "AND",
                              type2: "contains",
                              value2: "",
                            }
                          }
                          onChange={(value) =>
                            handleTempFilterChange(
                              column.accessor as string,
                              value
                            )
                          }
                          onApply={() => applyFilter(column.accessor as string)}
                          onClear={() =>
                            removeFilter(column.accessor as string)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.length ? (
              data.items.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessor as string}>
                      {column.render
                        ? column.render(item[column.accessor])
                        : String(item[column.accessor])}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actions(item)}</TableCell>}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isFetching && !isLoading && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || isFetching}
            >
              Previous
            </Button>
            <span className="mx-2">
              Page {page} of {Math.ceil((data?.total || 0) / pageSize)}
            </span>
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!data?.hasMore || isFetching}
            >
              Next
            </Button>
          </div>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
            disabled={isFetching}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
