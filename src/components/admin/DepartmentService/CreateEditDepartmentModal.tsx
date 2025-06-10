import { Modal, TextInput, Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";
import { DepartmentResponse } from "../../../types/Admin/Department/DepartmentTypeResponse";

interface CreateEditDepartmentModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: DepartmentResponse | null;
  onSubmit: (data: Partial<DepartmentResponse>) => void;
  isViewMode?: boolean;
}

const CreateEditDepartmentModal: React.FC<CreateEditDepartmentModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const form = useForm<Partial<DepartmentResponse>>({
    initialValues: {
      name: "",
      description: "",
      roomNumber: "",
      type: DepartmentType.CONSULTATION, // Default value
    },
    validate: {
      name: (value) => (value?.length ? null : "Tên phòng không được bỏ trống"),
      roomNumber: (value) =>
        value?.length ? null : "Số phòng không được bỏ trống",
      type: (value) => (!value ? "Loại phòng không được để trống" : null),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues(initialData);
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialData ? "Cập nhật phòng ban" : "Tạo mới phòng ban"}
      size="lg"
      radius="md"
      yOffset={90}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
          onClose();
        })}
      >
        <TextInput
          label="Tên phòng ban"
          placeholder="Nhập tên"
          {...form.getInputProps("name")}
          required
          disabled={isViewMode}
        />

        <TextInput
          label="Mô tả"
          placeholder="Nhập mô tả"
          {...form.getInputProps("description")}
          mt="sm"
          disabled={isViewMode}
        />

        <TextInput
          label="Số phòng"
          placeholder="Nhập số phòng"
          {...form.getInputProps("roomNumber")}
          mt="sm"
          required
          disabled={isViewMode}
        />

        <Select
          label="Loại phòng"
          placeholder="Chọn loại"
          data={Object.entries(DepartmentType).map(([value, label]) => ({
            value,
            label,
          }))}
          {...form.getInputProps("type")}
          mt="sm"
          required
          disabled={isViewMode}
        />

        {!isViewMode && (
          <Button type="submit" fullWidth mt="md">
            {initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default CreateEditDepartmentModal;
