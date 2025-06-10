import { Modal, TextInput, Textarea, Button, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { Role, CreateRoleRequest } from "../../../types/RolePage";

interface CreateEditModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: Role | null;
  onSubmit: (formData: CreateRoleRequest) => void;
  isViewMode?: boolean;
}

const RESOURCES = [
  "Cơ sở",
  "Dịch vụ",
  "Lớp học",
  "Học sinh",
  "Hóa đơn",
  "Biên lai thu tiền",
  "Nhóm tài khoản",
  "Quản lý người dùng",
  "Tiền thừa",
];

const ACTIONS = [
  { key: "view", label: "Xem" },
  { key: "create", label: "Thêm" },
  { key: "update", label: "Sửa" },
  { key: "delete", label: "Xóa" },
  { key: "custom", label: "Quyền khác" }, // để minh họa, bạn có thể làm nhiều quyền khác tùy logic
];

const CreateEditModal: React.FC<CreateEditModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      permissions: RESOURCES.map((resource) => ({
        resource,
        actions: [],
      })),
    } as CreateRoleRequest,

    validate: {
      name: (value) =>
        value.length < 3 || value.length > 100
          ? "Tên phải nằm trong khoảng từ 3 đến 100 ký tự"
          : null,
      description: (value) =>
        value.length > 500 ? "Mô tả có tối đa 500 ký tự" : null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        permissions: RESOURCES.map((resource) => {
          const existing = initialData.permissions.find(
            (p) => p.resource === resource
          );
          return {
            resource,
            actions: existing ? existing.actions : [],
          };
        }),
      });
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  const toggleAction = (resource: string, action: string) => {
    const updatedPermissions = form.values.permissions.map((perm) => {
      if (perm.resource !== resource) return perm;

      const hasAction = perm.actions.includes(action);
      return {
        ...perm,
        actions: hasAction
          ? perm.actions.filter((a) => a !== action)
          : [...perm.actions, action],
      };
    });

    form.setFieldValue("permissions", updatedPermissions);
  };

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
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
            {initialData ? "Cập nhật loại tài khoản" : "Tạo loại tài khoản"}
          </h2>
          <div className="mt-2 border-b border-gray-300"></div>
        </div>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Tên loại tài khoản"
          placeholder="Tên loại tài khoản"
          {...form.getInputProps("name")}
          required
          disabled={isViewMode}
        />

        <Textarea
          label="Mô tả"
          placeholder="Mô tả"
          {...form.getInputProps("description")}
          mt="sm"
          disabled={isViewMode}
        />

        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Quyền hạn</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Nhóm quyền</th>
                  {ACTIONS.map((action) => (
                    <th key={action.key} className="border p-2 text-center">
                      {action.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.values.permissions.map((perm, index) => (
                  <tr key={perm.resource}>
                    <td className="border p-2">{perm.resource}</td>
                    {ACTIONS.map((action) => (
                      <td key={action.key} className="border p-2 text-center">
                        <Checkbox
                          checked={perm.actions.includes(action.key)}
                          onChange={() =>
                            toggleAction(perm.resource, action.key)
                          }
                          disabled={isViewMode}
                        />
                      </td>
                    ))}
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
    </Modal>
  );
};

export default CreateEditModal;
