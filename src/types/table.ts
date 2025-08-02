export interface Column<T> {
  key: keyof T | string;
    label: string | React.ReactNode;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
}
