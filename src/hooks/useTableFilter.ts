
import { useState } from "react";

export type SortDirection = "asc" | "desc";

export interface TableFilterState<TFilter, TSortKey extends string = string> {
  filters: TFilter;
  setFilters: React.Dispatch<React.SetStateAction<TFilter>>;
  setFilterField: <K extends keyof TFilter>(field: K, value: TFilter[K]) => void;
  sortKey: TSortKey;
  sortDirection: SortDirection;
  setSortKey: (key: TSortKey) => void;
  setSortDirection: (dir: SortDirection) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
}

export function useTableFilter<
  TFilter extends Record<string, any>,
  TSortKey extends string = string
>(
  initialFilters: TFilter,
  defaultSortKey: TSortKey,
  defaultSortDirection: SortDirection = "desc"
): TableFilterState<TFilter, TSortKey> {
  const [filters, setFilters] = useState<TFilter>(initialFilters);
  const [sortKey, setSortKey] = useState<TSortKey>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const setFilterField = <K extends keyof TFilter>(field: K, value: TFilter[K]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSortKey(defaultSortKey);
    setSortDirection(defaultSortDirection);
    setPage(1);
    setPageSize(10);
  };

  return {
    filters,
    setFilters,
    setFilterField,
    sortKey,
    sortDirection,
    setSortKey,
    setSortDirection,
    page,
    setPage,
    pageSize,
    setPageSize,
    resetFilters,
  };
}

