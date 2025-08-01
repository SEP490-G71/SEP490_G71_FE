import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import useRoleService from "../../../hooks/role/useRoleService";
import { toast } from "react-toastify";
import CreateEditModal from "../../../components/admin/Role/CreateEditModal";
import { Role, RoleRequest } from "../../../types/Admin/Role/RolePage";
import axiosInstance from "../../../services/axiosInstance";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

const RolePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof Role | undefined>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { setting } = useSettingAdminService();

  const {
    roles,
    totalItems,
    loading,
    fetchAllRoles,
    fetchRoleById,
    handleDeleteRoleById,
  } = useRoleService();

  const [isViewMode, setIsViewMode] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [searchNameInput, setSearchNameInput] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]); // Lấy phần tử đầu tiên
    }
  }, [setting]);

  useEffect(() => {
    fetchAllRoles(page - 1, pageSize, sortKey || "name", sortDirection, {
      name: searchName,
    });
  }, [page, pageSize, sortKey, sortDirection, searchName]);

  const handleAdd = () => {
    setSelectedRole(null);
    setModalOpened(true);
  };

  const handleView = async (row: Role) => {
    const data = await fetchRoleById(row.name);
    if (data) {
      setSelectedRole(data);
      setIsViewMode(true);
      setModalOpened(true);
    } else {
      toast.error("Failed to fetch role details");
    }
  };

  const handleEdit = async (row: Role) => {
    const data = await fetchRoleById(row.name);
    if (data) {
      setSelectedRole(data);
      setModalOpened(true);
    } else {
      toast.error("Failed to fetch role details");
    }
  };

  const handleDelete = async (row: Role) => {
    await handleDeleteRoleById(row.name);
  };

  const handleSubmit = async (formData: RoleRequest) => {
    try {
      if (selectedRole) {
        await axiosInstance.put(`/roles/${selectedRole.name}`, formData);
        toast.success("Cập nhật thành công");
      } else {
        await axiosInstance.post("/roles", formData);
        toast.success("Tạo mới thành công");
      }
      fetchAllRoles(page - 1, pageSize, sortKey || "name", sortDirection, {
        name: searchName,
      });
    } catch (error: any) {
      console.error("Error saving role", error);
      toast.error(error.response?.data?.message || "Lỗi khi lưu vai trò");
    } finally {
      setModalOpened(false);
    }
  };

  const handleSearch = () => {
    setSearchName(searchNameInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchNameInput("");
    setSearchName("");
    setPage(1);
  };

  const columns = [
    createColumn<Role>({
      key: "name",
      label: "Vai trò",
      sortable: false,
    }),
    createColumn<Role>({
      key: "description",
      label: "Mô tả",
      sortable: false,
    }),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Quản lý vai trò</h1>
        <Button onClick={handleAdd} color="blue">
          Tạo
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 my-4">
        <div className="col-span-12 md:col-span-10">
          <FloatingLabelWrapper label="Vai trò">
            <TextInput
              placeholder="Nhập tên vai trò"
              value={searchNameInput}
              onChange={(event) =>
                setSearchNameInput(event.currentTarget.value)
              }
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2 flex items-end gap-2">
          <Button variant="light" color="gray" onClick={handleReset} fullWidth>
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            fullWidth
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={roles}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
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

      <CreateEditModal
        isViewMode={isViewMode}
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
        }}
        initialData={selectedRole}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default RolePage;
