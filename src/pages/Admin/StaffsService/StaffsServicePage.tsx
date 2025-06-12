import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { StaffsResponse } from "../../../types/Admin/Staffs/StaffsTypeResponse";
import { StaffsRequest } from "../../../types/Admin/Staffs/StaffsTypeRequest";
import { Gender, Specialty, Level } from "../../../enums/Admin/StaffsEnums";
import CreateEditStaffModal from "../../../components/admin/StaffsService/CreateEditStaffModal";

// 👉 Hàm chuyển enum key sang value an toàn
function getEnumLabel<T extends Record<string, string>>(
  enumObj: T,
  key: string
): string {
  return enumObj[key as keyof T] ?? key;
}

const StaffsServicePage = () => {
  const [staffs, setStaffs] = useState<StaffsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof StaffsResponse>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [modalOpened, setModalOpened] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffsRequest | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        size: pageSize,
        sortBy: sortKey,
        sortDir: sortDirection,
        name: filterName || undefined,
        specialty: filterSpecialty || undefined,
        level: filterLevel || undefined,
      };

      const res = await axiosInstance.get(`/staffs`, { params });
      const content = res.data.result?.content || [];
      const total = res.data.result?.totalElements || 0;

      setStaffs(content);
      setTotalItems(total);

      if (content.length === 0) {
        toast.info("Không có dữ liệu nhân viên");
      }
    } catch (error: any) {
      toast.error("Không thể tải dữ liệu nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [
    page,
    pageSize,
    sortKey,
    sortDirection,
    filterName,
    filterSpecialty,
    filterLevel,
  ]);

  const convertResponseToRequest = (res: StaffsResponse): StaffsRequest => ({
    name: res.name,
    email: res.email,
    phone: res.phone,
    gender: res.gender,
    dob: res.dob,
    level: res.level,
    specialty: res.specialty,
    accountId: res.accountId,
  });

  const handleAdd = () => {
    setSelectedStaff(null);
    setEditingId(null);
    setModalOpened(true);
  };

  const handleView = async (row: StaffsResponse) => {
    try {
      const res = await axiosInstance.get(`/staffs/${row.id}`);
      setSelectedStaff(convertResponseToRequest(res.data.result));
      setIsViewMode(true);
      setModalOpened(true);
    } catch {
      toast.error("Không thể xem chi tiết nhân viên");
    }
  };

  const handleEdit = async (row: StaffsResponse) => {
    try {
      const res = await axiosInstance.get(`/staffs/${row.id}`);
      setSelectedStaff(convertResponseToRequest(res.data.result));
      setEditingId(row.id);
      setModalOpened(true);
    } catch {
      toast.error("Không thể tải dữ liệu nhân viên");
    }
  };

  const handleDelete = async (row: StaffsResponse) => {
    try {
      await axiosInstance.delete(`/staffs/${row.id}`);
      toast.success("Xoá thành công");
      fetchStaffs();
    } catch {
      toast.error("Xoá thất bại");
    }
  };

  const handleSubmit = async (data: StaffsRequest) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/staffs/${editingId}`, data);
        toast.success("Cập nhật thành công");
      } else {
        await axiosInstance.post(`/staffs`, data);
        toast.success("Tạo nhân viên thành công");
      }
      fetchStaffs();
    } catch {
      toast.error("Lỗi khi lưu nhân viên");
    } finally {
      setModalOpened(false);
      setEditingId(null);
    }
  };

  const columns = [
    createColumn<StaffsResponse>({
      key: "name",
      label: "Họ tên",
      sortable: true,
    }),
    createColumn<StaffsResponse>({ key: "email", label: "Email" }),
    createColumn<StaffsResponse>({ key: "phone", label: "SĐT" }),
    createColumn<StaffsResponse>({
      key: "specialty",
      label: "Chuyên môn",
      render: (row) => getEnumLabel(Specialty, row.specialty),
    }),
    createColumn<StaffsResponse>({
      key: "level",
      label: "Cấp bậc",
      render: (row) => getEnumLabel(Level, row.level),
    }),
    createColumn<StaffsResponse>({
      key: "gender",
      label: "Giới tính",
      render: (row) => getEnumLabel(Gender, row.gender),
    }),
    createColumn<StaffsResponse>({ key: "dob", label: "Ngày sinh" }),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Nhân viên</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Thêm nhân viên
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        <input
          type="text"
          placeholder="Tìm theo tên"
          className="border rounded px-3 py-2 text-sm w-full h-[40px]"
          value={filterName}
          onChange={(e) => {
            setPage(1);
            setFilterName(e.target.value);
          }}
        />

        <Select
          placeholder="Chọn chuyên môn"
          className="w-full"
          styles={{ input: { height: 45 } }}
          value={filterSpecialty || ""}
          onChange={(val) => {
            setPage(1);
            setFilterSpecialty(val || "");
          }}
          data={[
            { value: "", label: "Tất cả" },
            ...Object.entries(Specialty).map(([key, value]) => ({
              value: key,
              label: value,
            })),
          ]}
        />

        <Select
          placeholder="Chọn cấp bậc"
          className="w-full"
          styles={{ input: { height: 45 } }}
          value={filterLevel || ""}
          onChange={(val) => {
            setPage(1);
            setFilterLevel(val || "");
          }}
          data={[
            { value: "", label: "Tất cả" },
            ...Object.entries(Level).map(([key, value]) => ({
              value: key,
              label: value,
            })),
          ]}
        />
      </div>

      <CustomTable
        data={staffs}
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
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateEditStaffModal
        isViewMode={isViewMode}
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
          setEditingId(null);
        }}
        initialData={selectedStaff}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default StaffsServicePage;
