import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import useRoleService from "../../../hooks/role/useRoleService";
import { toast } from "react-toastify";
import CreateEditModal from "../../../components/admin/Role/CreateEditModal";
import { Role, CreateRoleRequest } from "../../../types/RolePage";
import axiosInstance from "../../../services/axiosInstance";

const RolePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof Role | undefined>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const {
    roles,
    totalItems,
    loading,
    fetchAllRoles,
    fetchRoleById,
    handleDeleteRoleById,
  } = useRoleService();

  const [searchName, setSearchName] = useState<string>("");

  const [isViewMode, setIsViewMode] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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
    const data = await fetchRoleById(row.id);
    if (data) {
      setSelectedRole(data);
      setIsViewMode(true);
      setModalOpened(true);
    } else {
      toast.error("Failed to fetch role details");
    }
  };

  const handleEdit = async (row: Role) => {
    const data = await fetchRoleById(row.id);
    if (data) {
      setSelectedRole(data);
      setModalOpened(true);
    } else {
      toast.error("Failed to fetch role details");
    }
  };

  const handleDelete = async (row: Role) => {
    await handleDeleteRoleById(row.id);
  };

  const handleSubmit = async (formData: CreateRoleRequest) => {
    try {
      if (selectedRole) {
        await axiosInstance.put(`/roles/${selectedRole.id}`, formData);
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post("/roles", formData);
        toast.success("Created successfully");
      }
      fetchAllRoles(page - 1, pageSize, sortKey || "name", sortDirection, {
        name: searchName,
      });
    } catch (error) {
      console.error("Error saving role", error);
      toast.error("An error occurred");
    } finally {
      setModalOpened(false);
    }
  };

  const columns = [
    createColumn<Role>({
      key: "id",
      label: "Mã",
      sortable: true,
    }),
    createColumn<Role>({
      key: "name",
      label: "Vai trò",
      sortable: true,
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

      <div className="flex flex-wrap gap-2 my-4">
        <TextInput
          placeholder="Nhập tên vai trò"
          value={searchName}
          onChange={(event) => {
            setSearchName(event.currentTarget.value);
            setPage(1);
          }}
          className="flex-1 min-w-[150px]"
        />
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
