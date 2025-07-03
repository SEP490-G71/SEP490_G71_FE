import React, { useMemo, useState } from "react";
import {
  FaCaretUp,
  FaCaretDown,
  FaEye,
  FaPencilAlt,
  FaTrash,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { Column } from "../../types/table";
import { Modal, Button, Loader } from "@mantine/core";

interface CustomTableProps<T> {
  data?: T[];
  columns?: Column<T>[];
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (key: keyof T, direction: "asc" | "desc") => void;
  sortKey?: keyof T;
  sortDirection?: "asc" | "desc";
  loading?: boolean;
  emptyText?: string;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  showActions?: boolean;
  getRowStyle?: (row: T) => React.CSSProperties;
}

function CustomTable<T>({
  data = [],
  columns = [],
  page,
  pageSize,
  totalItems,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
  onSortChange,
  sortKey,
  sortDirection,
  loading = false,
  emptyText = "Không có dữ liệu",
  onView,
  onEdit,
  onDelete,
  showActions = true,
  getRowStyle,
}: CustomTableProps<T>) {
  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  );

  const handleSort = (key: keyof T) => {
    if (!onSortChange) return;
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSortChange(key, newDirection);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<T | null>(null);

  return (
    <div className="w-full border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs font-semibold uppercase">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-5 py-3 cursor-pointer select-none whitespace-nowrap"
                  onClick={() => col.sortable && handleSort(col.key as keyof T)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <>
                        {sortKey === col.key ? (
                          sortDirection === "asc" ? (
                            <FaCaretUp className="w-4 h-4" />
                          ) : (
                            <FaCaretDown className="w-4 h-4" />
                          )
                        ) : (
                          <FaCaretUp className="w-4 h-4 opacity-30" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="px-5 py-3 whitespace-nowrap">Thao Tác</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center py-12"
                >
                  <Loader size="lg" variant="dots" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center py-6"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="transition-colors"
                  style={getRowStyle ? getRowStyle(row) : {}}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-5 py-4 whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-5 py-4 flex flex-wrap items-center justify-start gap-2 whitespace-nowrap">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white transition duration-200"
                          title="Xem chi tiết"
                        >
                          <FaEye size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-green-500 hover:text-white transition duration-200"
                          title="Chỉnh sửa"
                        >
                          <FaPencilAlt size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            setRowToDelete(row);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-red-500 hover:text-white transition duration-200"
                          title="Xóa"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-white dark:bg-gray-800 border-t text-sm text-gray-600 dark:text-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Hiển thị tối đa</span>
            <select
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange && onPageSizeChange(Number(e.target.value))
              }
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>trên {totalItems} kết quả</span>
          </div>
        </div>

        <div className="flex items-center flex-wrap justify-start gap-1 sm:gap-2 text-sm text-gray-600 dark:text-gray-300">
          <button
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded ${
                p === page
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => page < totalPages && onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={
          <div>
            <h2 className="text-xl font-bold">Xác nhận xoá</h2>
            <div className="mt-2 border-b border-gray-300"></div>
          </div>
        }
      >
        <div className="text-sm mb-4">
          Bạn có chắc chắn muốn xoá dịch vụ này không?
        </div>
        <div className="flex justify-end gap-2">
          <Button color="blue" onClick={() => setIsDeleteModalOpen(false)}>
            Huỷ
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (rowToDelete && onDelete) {
                onDelete(rowToDelete);
              }
              setIsDeleteModalOpen(false);
            }}
          >
            Xoá
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default CustomTable;
