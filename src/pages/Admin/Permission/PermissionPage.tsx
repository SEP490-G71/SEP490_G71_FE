// pages/admin/PermissionPage.tsx
import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { toast } from "react-toastify";
import usePermissionService from "../../../hooks/permisson/usePermissionService";
import CreateEditModal from "../../../components/admin/Permission/CreateEditModal";
import { PermissionWithGroup } from "../../../types/Admin/Role/RolePage";

const PermissionPage = () => {
  const {
    fetchGroupedPermissions,
    createPermission,
    updatePermission,
    deletePermission,
  } = usePermissionService();

  const [permissions, setPermissions] = useState<PermissionWithGroup[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionWithGroup | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchName, setSearchName] = useState<string>("");

  const loadPermissions = async () => {
    const groupedPermissions = await fetchGroupedPermissions();
    const flattenedPermissions: PermissionWithGroup[] =
      groupedPermissions.flatMap((group) =>
        group.permissions.map((permission) => ({
          ...permission,
          groupName: group.groupName,
        }))
      );

    setPermissions(
      flattenedPermissions.filter((perm) =>
        perm.name.toLowerCase().includes(searchName.toLowerCase())
      )
    );
  };

  useEffect(() => {
    loadPermissions();
  }, [searchName]);

  const handleAdd = () => {
    setSelectedPermission(null);
    setIsViewMode(false);
    setModalOpened(true);
  };

  const handleView = (row: PermissionWithGroup) => {
    setSelectedPermission(row);
    setIsViewMode(true);
    setModalOpened(true);
  };

  const handleEdit = (row: PermissionWithGroup) => {
    setSelectedPermission(row);
    setIsViewMode(false);
    setModalOpened(true);
  };

  const handleDelete = async (row: PermissionWithGroup) => {
    try {
      await deletePermission(row.name);
      toast.success("Deleted successfully");
      loadPermissions();
    } catch (error) {
      console.error("Failed to delete permission", error);
      toast.error("Failed to delete permission");
    }
  };

  const handleSubmit = async (formData: {
    name: string;
    description?: string;
    groupName: string;
  }) => {
    try {
      if (selectedPermission) {
        await updatePermission(selectedPermission.name, {
          description: formData.description,
          groupName: formData.groupName,
        });
        toast.success("Updated successfully");
      } else {
        await createPermission(formData);
        toast.success("Created successfully");
      }
      loadPermissions();
    } catch (error) {
      console.error("Error saving permission", error);
      toast.error("An error occurred");
    } finally {
      setModalOpened(false);
      setIsViewMode(false);
    }
  };

  const columns = [
    createColumn<PermissionWithGroup>({
      key: "name",
      label: "Tên Permission",
      sortable: true,
    }),
    createColumn<PermissionWithGroup>({
      key: "description",
      label: "Mô tả",
      sortable: false,
    }),
    createColumn<PermissionWithGroup>({
      key: "groupName",
      label: "Nhóm Permission",
      sortable: false,
    }),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Permission</h1>
        <Button onClick={handleAdd} color="blue">
          Tạo
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 my-4">
        <TextInput
          placeholder="Nhập tên permission"
          value={searchName}
          onChange={(event) => setSearchName(event.currentTarget.value)}
          className="flex-1 min-w-[150px]"
        />
      </div>

      <CustomTable
        data={permissions}
        columns={columns}
        page={1}
        pageSize={permissions.length}
        totalItems={permissions.length}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        loading={false}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateEditModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
        }}
        initialData={selectedPermission}
        onSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </>
  );
};

export default PermissionPage;
