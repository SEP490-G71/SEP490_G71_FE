import { useEffect, useState } from "react";
import { Button, Select, TextInput } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { toast } from "react-toastify";
import { StaffsResponse } from "../../../types/Admin/Staffs/StaffsTypeResponse";
import { StaffsRequest } from "../../../types/Admin/Staffs/StaffsTypeRequest";
import { Gender } from "../../../enums/Admin/StaffsEnums";
import PageMeta from "../../../components/common/PageMeta";
import dayjs from "dayjs";
import CreateEditStaffModal from "../../../components/admin/Staffs/CreateEditStaffModal";
import { RoleLabels } from "../../../enums/Role/Role";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import useStaffs from "../../../hooks/staffs-service/useStaffs";
import useRoleService from "../../../hooks/role/useRoleService";

function getEnumLabel<T extends Record<string, string>>(
  enumObj: T,
  key: string
): string {
  return enumObj[key as keyof T] ?? key;
}

const StaffsPage = () => {
  const {
    staffs,
    totalItems,
    loading,
    fetchStaffList,
    fetchStaffsById,
    createStaffs,
    updateStaffs,
    deleteStaffs,
  } = useStaffs();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [inputRole, setInputRole] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffsRequest | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [inputStaffCode, setInputStaffCode] = useState("");
  const [filterStaffCode, setFilterStaffCode] = useState("");

  const { setting } = useSettingAdminService();

  const { roles, fetchAllRoles } = useRoleService();

  useEffect(() => {
    fetchAllRoles(0, 100);
  }, []);
  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchStaffList({
      page: page - 1,
      size: pageSize,
      name: filterName || undefined,
      role: filterRoles.length > 0 ? filterRoles[0] : undefined,
      phone: filterPhone || undefined,
      staffCode: filterStaffCode || undefined,
    });
  }, [page, pageSize, filterName, filterRoles, filterPhone]);

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
  });

  const handleAdd = () => {
    setSelectedStaff(null);
    setEditingId(null);
    setModalOpened(true);
  };

  const handleView = async (row: StaffsResponse) => {
    const res = await fetchStaffsById(row.id);
    if (res) {
      setSelectedStaff(convertResponseToRequest(res));
      setIsViewMode(true);
      setModalOpened(true);
    } else {
      toast.error("Không thể xem chi tiết nhân viên");
    }
  };

  const handleEdit = async (row: StaffsResponse) => {
    const res = await fetchStaffsById(row.id);
    if (res) {
      setSelectedStaff(convertResponseToRequest(res));
      setEditingId(row.id);
      setModalOpened(true);
    } else {
      toast.error("Không thể tải dữ liệu nhân viên");
    }
  };

  const handleDelete = async (row: StaffsResponse) => {
    await deleteStaffs(row.id);
    fetchStaffList({
      page: page - 1,
      size: pageSize,
      name: filterName || undefined,
      role: filterRoles.length > 0 ? filterRoles[0] : undefined,
      phone: filterPhone || undefined,
      staffCode: filterStaffCode || undefined,
    });
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
      await updateStaffs(editingId, normalizedData);
      toast.success("Cập nhật thành công");
    } else {
      await createStaffs(normalizedData);
      toast.success("Tạo nhân viên thành công");
    }
    fetchStaffList({
      page: page - 1,
      size: pageSize,
      name: filterName || undefined,
      role: filterRoles.length > 0 ? filterRoles[0] : undefined,
      phone: filterPhone || undefined,
      staffCode: filterStaffCode || undefined,
    });
    setModalOpened(false);
    setEditingId(null);
  };

  const handleSearch = () => {
    setPage(1);
    setFilterName(inputName.trim());
    setFilterPhone(inputPhone.trim());
    setFilterRoles(inputRole ? [inputRole] : []);
    setFilterStaffCode(inputStaffCode.trim());
  };

  const handleReset = () => {
    setInputName("");
    setFilterName("");
    setFilterRoles([]);
    setInputPhone("");
    setFilterPhone("");
    setInputRole(null);
    setFilterRoles([]);
    setPage(1);
    fetchStaffList({ page: 0, size: pageSize });
  };

  const columns = [
    createColumn<StaffsResponse>({ key: "staffCode", label: "Mã nhân viên" }),
    createColumn<StaffsResponse>({ key: "fullName", label: "Họ và tên" }),
    createColumn<StaffsResponse>({ key: "phone", label: "SĐT" }),
    createColumn<StaffsResponse>({
      key: "roles",
      label: "Vai trò",
      render: (row) => {
        const fullRoles = row.roles.map((r) => RoleLabels[r] || r).join(", ");
        const short =
          fullRoles.length > 30 ? fullRoles.slice(0, 30) + "..." : fullRoles;

        return <span title={fullRoles}>{short}</span>;
      },
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
    createColumn<StaffsResponse>({
      key: "departmentInfo",
      label: "Phòng ban",
      render: (row) =>
        row.department
          ? `${row.department.roomNumber} - ${row.department.name}`
          : "Chưa được gán",
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
        <Button color="blue" onClick={handleAdd}>
          Tạo
        </Button>
      </div>

      <div className="my-4 flex flex-col sm:flex-row sm:items-end sm:gap-4">
        {/* 4 ô input đều nhau */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
          <FloatingLabelWrapper label="Chọn vai trò">
            <Select
              key={inputRole || "empty"}
              placeholder="Vai trò"
              className="w-full"
              styles={{ input: { height: 35 } }}
              value={inputRole}
              onChange={setInputRole}
              data={roles.map((r) => ({
                value: r.name,
                label: r.description || r.name,
              }))}
              searchable
              clearable
            />
          </FloatingLabelWrapper>

          <FloatingLabelWrapper label="Tìm theo tên">
            <TextInput
              type="text"
              placeholder="Nhập tên"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </FloatingLabelWrapper>

          <FloatingLabelWrapper label="Tìm theo mã NV">
            <TextInput
              type="text"
              placeholder="Nhập mã nhân viên"
              value={inputStaffCode}
              onChange={(e) => setInputStaffCode(e.target.value)}
            />
          </FloatingLabelWrapper>

          <FloatingLabelWrapper label="Tìm theo SDT">
            <TextInput
              type="text"
              placeholder="Nhập SDT"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút bên phải */}
        <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
          <Button
            variant="light"
            color="gray"
            onClick={handleReset}
            style={{ height: 35 }}
          >
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            style={{ height: 35 }}
          >
            Tìm kiếm
          </Button>
        </div>
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
        roles={roles}
      />
    </>
  );
};

export default StaffsPage;
