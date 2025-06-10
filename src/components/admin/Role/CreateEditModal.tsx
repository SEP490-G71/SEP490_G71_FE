import { useEffect, useState, useCallback } from "react";
import {
  Checkbox,
  Modal,
  TextInput,
  Textarea,
  Button,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import usePermissionService from "../../../hooks/permisson/usePermissionService";
import {
  Role,
  GroupedPermissionResponse,
  PermissionResponse,
  RoleRequest as CreateRoleRequest,
} from "../../../types/RolePage";

interface RoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

interface CreateEditModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: Role | null;
  onSubmit: (formData: CreateRoleRequest) => void;
  isViewMode?: boolean;
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const { fetchGroupedPermissions } = usePermissionService();
  const [groupedPermissions, setGroupedPermissions] = useState<
    GroupedPermissionResponse[]
  >([]);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      permissions: [] as { name: string }[],
    },
    validate: {
      name: (value) =>
        value.trim().length < 3 || value.length > 100
          ? "Tên phải từ 3 đến 100 ký tự"
          : null,
      description: (value) =>
        value.length > 500 ? "Mô tả không quá 500 ký tự" : null,
    },
  });

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        const result = await fetchGroupedPermissions();
        setGroupedPermissions(result);
        console.log("✅ Fetched permissions:", result);
      } catch (err) {
        console.error("❌ Failed to fetch permissions", err);
      } finally {
        setLoading(false);
      }
    };

    if (opened) {
      loadPermissions();
    }
  }, [opened]);

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name || "",
        description: initialData.description || "",
        permissions: initialData.permissions.map((p) => ({ name: p.name })),
      });
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  const togglePermission = useCallback(
    (permission: PermissionResponse) => {
      const exists = form.values.permissions.some(
        (p) => p.name === permission.name
      );
      const updated = exists
        ? form.values.permissions.filter((p) => p.name !== permission.name)
        : [...form.values.permissions, { name: permission.name }];

      console.log(
        `[TOGGLE] ${exists ? "Unchecked" : "Checked"} permission:`,
        permission.name
      );
      console.log("🔄 Updated permissions:", updated);

      form.setFieldValue("permissions", updated);
    },
    [form]
  );

  const handleSubmit = (values: typeof form.values) => {
    const payload: RoleRequest = {
      name: values.name,
      description: values.description,
      permissions: [...new Set(values.permissions.map((p) => p.name))],
    };

    console.log("🚀 Submitting RoleRequest:", payload);
    onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={
        <div>
          <h2 className="text-xl font-bold">
            {initialData ? "Cập nhật vai trò" : "Tạo vai trò"}
          </h2>
          <div className="mt-2 border-b border-gray-300" />
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader />
        </div>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Tên vai trò"
            placeholder="Tên vai trò"
            {...form.getInputProps("name")}
            required
            disabled={isViewMode}
          />

          <Textarea
            label="Mô tả"
            placeholder="Mô tả vai trò"
            {...form.getInputProps("description")}
            mt="sm"
            disabled={isViewMode}
          />

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Phân quyền</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2">Nhóm quyền</th>
                    <th className="p-2 text-center">Xem</th>
                    <th className="p-2 text-center">Thêm</th>
                    <th className="p-2 text-center">Sửa</th>
                    <th className="p-2 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedPermissions.map((group) => (
                    <tr
                      key={group.groupName}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-2 font-medium">{group.groupName}</td>
                      {["view", "create", "update", "delete"].map((action) => {
                        const perm = group.permissions.find((p) =>
                          p.name.startsWith(`${action}:`)
                        );
                        return (
                          <td key={action} className="p-2 text-center">
                            {perm ? (
                              <Checkbox
                                checked={form.values.permissions.some(
                                  (p) => p.name === perm.name
                                )}
                                onChange={() => togglePermission(perm)}
                                disabled={isViewMode}
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!isViewMode && (
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">{initialData ? "Cập nhật" : "Lưu"}</Button>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
};

export default CreateEditModal;
