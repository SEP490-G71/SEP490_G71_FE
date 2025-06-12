import { Modal, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { PermissionWithGroup } from "../../../types/Admin/Role/RolePage";

interface CreateEditModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: PermissionWithGroup | null;
  onSubmit: (formData: {
    name: string;
    description?: string;
    groupName: string;
  }) => void;
  isViewMode?: boolean;
}

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
      groupName: "",
    },
    validate: {
      name: (value) =>
        value.length < 3 || value.length > 100
          ? "Tên phải nằm trong khoảng từ 3 đến 100 ký tự"
          : null,
      groupName: (value) =>
        value.length < 3 || value.length > 100
          ? "Tên nhóm phải nằm trong khoảng từ 3 đến 100 ký tự"
          : null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        groupName: initialData.groupName ?? "",
      });
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-xl font-bold">
            {isViewMode
              ? "Xem Permission"
              : initialData
              ? "Cập nhật Permission"
              : "Tạo Permission"}
          </h2>
          <div className="mt-2 border-b border-gray-300"></div>
        </div>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Tên permission"
          placeholder="Tên permission"
          {...form.getInputProps("name")}
          required
          disabled={isViewMode || !!initialData} // Disable khi View hoặc đang Edit (name không sửa được khi edit)
        />

        <TextInput
          label="Mô tả"
          placeholder="Mô tả"
          {...form.getInputProps("description")}
          mt="sm"
          disabled={isViewMode} // Disable khi View
        />

        <TextInput
          label="Nhóm permission"
          placeholder="Nhóm permission"
          {...form.getInputProps("groupName")}
          required
          mt="sm"
          disabled={isViewMode} // Disable khi View
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {!isViewMode && (
            <Button type="submit">{initialData ? "Cập nhật" : "Tạo"}</Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreateEditModal;
