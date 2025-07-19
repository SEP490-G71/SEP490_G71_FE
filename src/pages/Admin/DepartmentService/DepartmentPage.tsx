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
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";

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
  const [inputRoom, setInputRoom] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const { setting } = useSettingAdminService();
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
          roomNumber: filterRoom || undefined,
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
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]); // Lấy phần tử đầu tiên
    }
  }, [setting]);

  useEffect(() => {
    fetchDepartments();
  }, [
    page,
    pageSize,
    sortKey,
    sortDirection,
    filterName,
    filterType,
    filterRoom,
  ]);

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

  const handleSubmit = async (data: DepartmentRequest) => {
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
    } catch (err) {
      console.error("Lỗi tạo/sửa phòng ban:", err);
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
    createColumn<DepartmentResponse>({
      key: "Specialization",
      label: "Chuyên khoa",
      render: (row) => row.specialization?.name ?? "Không có",
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

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-4 items-end">
        {/* Chọn loại phòng */}
        <div className="sm:col-span-3">
          <FloatingLabelWrapper label="Chọn loại phòng">
            <Select
              placeholder="Chọn loại phòng"
              className="w-full"
              styles={{ input: { height: 45 } }}
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
              clearable
              searchable
            />
          </FloatingLabelWrapper>
        </div>

        {/* Tìm theo tên */}
        <div className="sm:col-span-3">
          <FloatingLabelWrapper label="Tìm theo tên">
            <input
              type="text"
              placeholder="Tìm theo tên"
              className="border rounded px-3 text-sm w-full h-[45px]"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </FloatingLabelWrapper>
        </div>

        {/* Tìm theo số phòng */}
        <div className="sm:col-span-3">
          <FloatingLabelWrapper label="Tìm theo số phòng">
            <input
              type="text"
              placeholder="Tìm theo số phòng"
              className="border rounded px-3 text-sm w-full h-[45px]"
              value={inputRoom}
              onChange={(e) => setInputRoom(e.target.value)}
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút tìm và tải lại */}
        <div className="sm:col-span-3 flex justify-end gap-2">
          <button
            className="bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => {
              setInputName("");
              setFilterName("");
              setInputRoom("");
              setFilterRoom("");
              setFilterType("");
              setSortKey("name");
              setSortDirection("asc");
              setPage(1);
            }}
          >
            Tải lại
          </button>
          <button
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              const normalizeText = (text: string) =>
                text.trim().replace(/\s+/g, " ");
              setPage(1);
              setFilterName(normalizeText(inputName));
              setFilterRoom(normalizeText(inputRoom));
            }}
          >
            Tìm kiếm
          </button>
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
        pageSizeOptions={setting?.paginationSizeList
          .slice()
          .sort((a, b) => a - b)}
      />

      <CreateEditDepartmentModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingId(null);
        }}
        initialData={selectedDepartment}
        onSubmit={(data) => handleSubmit(data as DepartmentRequest)}
      />
    </>
  );
};

export default DepartmentPage;
