export interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
}
