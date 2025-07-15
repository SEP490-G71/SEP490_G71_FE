import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import { toast } from "react-toastify";
import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import axiosInstance from "../../../services/axiosInstance";
import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";
import { DepartmentResponse } from "../../../types/Admin/Department/DepartmentTypeResponse";
import CreateEditDepartmentModal from "../../../components/admin/Department/CreateEditDepartmentModal";

function getEnumLabel<T extends Record<string, string>>(
  enumObj: T,
  key: string
): string {
  return enumObj[key as keyof T] ?? key;
}

const DepartmentPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<keyof DepartmentResponse>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [modalOpened, setModalOpened] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentResponse | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/departments", {
        params: {
          page: page - 1,
          size: pageSize,
          sortBy: sortKey,
          sortDir: sortDirection,
          name: filterName || undefined,
          type: filterType || undefined,
        },
      });
      setDepartments(res.data.result?.content || []);
      setTotalItems(res.data.result?.totalElements || 0);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [page, pageSize, sortKey, sortDirection, filterName, filterType]);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setEditingId(null);
    setModalOpened(true);
  };

  const handleEdit = async (row: DepartmentResponse) => {
    try {
      const res = await axiosInstance.get(`/departments/${row.id}`);
      setSelectedDepartment(res.data.result);
      setEditingId(row.id);
      setModalOpened(true);
    } catch {
      toast.error("Lỗi khi lấy thông tin phòng ban");
    }
  };

  const handleDelete = async (row: DepartmentResponse) => {
    try {
      await axiosInstance.delete(`/departments/${row.id}`);
      toast.success("Xoá phòng ban thành công");
      fetchDepartments();
    } catch {
      toast.error("Xoá phòng ban thất bại");
    }
  };

  const handleSubmit = async (data: Partial<DepartmentResponse>) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/departments/${editingId}`, data);
        toast.success("Sửa phòng ban thành công");
      } else {
        await axiosInstance.post(`/departments`, data);
        toast.success("Tạo phòng ban thành công");
      }

      fetchDepartments();
      setModalOpened(false);
      setEditingId(null);
    } catch {
      toast.error("Lỗi khi lưu phòng ban");
    }
  };

  const columns = [
    createColumn<DepartmentResponse>({
      key: "name",
      label: "Tên phòng ban",
      sortable: true,
    }),
    createColumn<DepartmentResponse>({ key: "description", label: "Mô tả" }),
    createColumn<DepartmentResponse>({ key: "roomNumber", label: "Số phòng" }),
    createColumn<DepartmentResponse>({
      key: "type",
      label: "Loại phòng",
      render: (row) => getEnumLabel(DepartmentType, row.type),
    }),
  ];

  return (
    <>
      <PageMeta
        title="Quản lý phòng ban | Admin Dashboard"
        description="Trang quản lý phòng ban trong hệ thống"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Phòng ban</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Thêm phòng ban
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <div>
          <Select
            placeholder="Chọn loại phòng"
            className="w-full"
            styles={{ input: { height: 40 } }}
            value={filterType}
            onChange={(val) => {
              setPage(1);
              setFilterType(val || "");
            }}
            data={[
              { value: "", label: "Tất cả" },
              ...Object.entries(DepartmentType).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Tìm theo tên"
            className="border rounded px-3 py-2 text-sm w-full h-[40px]"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setFilterName(inputName.trim());
              }
            }}
          />
        </div>
      </div>

      <CustomTable
        data={departments}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        onSortChange={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateEditDepartmentModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingId(null);
        }}
        initialData={selectedDepartment}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default DepartmentPage;
