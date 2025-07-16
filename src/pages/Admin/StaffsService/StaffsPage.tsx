import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { StaffsResponse } from "../../../types/Admin/Staffs/StaffsTypeResponse";
import { StaffsRequest } from "../../../types/Admin/Staffs/StaffsTypeRequest";
import { Gender } from "../../../enums/Admin/StaffsEnums";
import PageMeta from "../../../components/common/PageMeta";
import dayjs from "dayjs";
import CreateEditStaffModal from "../../../components/admin/Staffs/CreateEditStaffModal";
import { RoleLabels } from "../../../enums/Role/Role";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";

function getEnumLabel<T extends Record<string, string>>(
  enumObj: T,
  key: string
): string {
  return enumObj[key as keyof T] ?? key;
}

const StaffsPage = () => {
  const [staffs, setStaffs] = useState<StaffsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof StaffsResponse>("firstName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffsRequest | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [filterName, setFilterName] = useState("");
  const { setting } = useSettingAdminService();
  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        size: pageSize,
        sortBy: sortKey,
        sortDir: sortDirection,
        name: filterName || undefined,
        role: filterRoles.length > 0 ? filterRoles[0] : undefined,
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
  }, [page, pageSize, sortKey, sortDirection, filterName, filterRoles]);

  const convertResponseToRequest = (res: StaffsResponse): StaffsRequest => ({
    firstName: res.firstName,
    middleName: res.middleName,
    lastName: res.lastName,
    fullName: res.fullName,
    email: res.email,
    phone: res.phone,
    gender: res.gender,
    dob: res.dob,
    roleNames: res.roles,
    //accountId: res.accountId,
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
    const normalizedData: StaffsRequest = {
      ...data,
      middleName: data.middleName ?? null,
      dob:
        typeof data.dob === "string"
          ? data.dob
          : new Date(data.dob).toISOString().split("T")[0],
      roleNames: data.roleNames,
    };

    if (editingId) {
      await axiosInstance.put(`/staffs/${editingId}`, normalizedData);
      toast.success("Cập nhật thành công");
    } else {
      await axiosInstance.post(`/staffs`, normalizedData);
      toast.success("Tạo nhân viên thành công");
    }

    fetchStaffs();
    setModalOpened(false);
    setEditingId(null);
  };

  const columns = [
    createColumn<StaffsResponse>({
      key: "fullName",
      label: "Họ và tên",
      render: (row) => row.fullName,
      sortable: false,
    }),
    createColumn<StaffsResponse>({ key: "email", label: "Email" }),
    createColumn<StaffsResponse>({ key: "phone", label: "SĐT" }),
    createColumn<StaffsResponse>({
      key: "roles",
      label: "Vai trò",
      render: (row) =>
        row.roles.map((role) => RoleLabels[role] || role).join(", "),
    }),
    createColumn<StaffsResponse>({
      key: "gender",
      label: "Giới tính",
      render: (row) => getEnumLabel(Gender, row.gender),
    }),
    createColumn<StaffsResponse>({
      key: "dob",
      label: "Ngày sinh",
      render: (row) => (row.dob ? dayjs(row.dob).format("DD/MM/YYYY") : ""),
    }),
  ];

  return (
    <>
      <PageMeta
        title="Quản lý nhân viên | Admin Dashboard"
        description="Trang quản lý nhân viên trong hệ thống"
      />
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
        <Select
          placeholder="Chọn vai trò"
          className="w-full"
          styles={{ input: { height: 45 } }}
          value={filterRoles[0] || ""}
          onChange={(val) => {
            setPage(1);
            setFilterRoles(val ? [val] : []);
          }}
          data={Object.entries(RoleLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          searchable
          clearable
        />

        <input
          type="text"
          placeholder="Tìm theo tên"
          className="border rounded px-3 text-sm w-full h-[45px]"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilterName(inputName.trim());
              setPage(1);
            }
          }}
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
        pageSizeOptions={setting?.paginationSizeList || [5, 10, 20, 50]}
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

export default StaffsPage;
