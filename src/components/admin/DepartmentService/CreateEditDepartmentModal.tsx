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
      type: DepartmentType.CONSULTATION,
    },
    validate: {
      name: (value) =>
        !value || value.trim() === ""
          ? "Tên phòng không được bỏ trống"
          : value.length < 3 || value.length > 100
          ? "Tên phòng phải từ 3 đến 100 ký tự"
          : null,

      description: (value) =>
        value && (value.length < 3 || value.length > 500)
          ? "Mô tả phải từ 3 đến 500 ký tự"
          : null,

      roomNumber: (value) =>
        !value || value.trim() === ""
          ? "Số phòng không được bỏ trống"
          : !/^[A-Za-z0-9]{2,5}$/.test(value)
          ? "Số phòng phải từ 2-5 ký tự, không dấu và không khoảng trắng"
          : null,

      type: (value) => (!value ? "Loại phòng không được để trống" : null),
    },
  });

  // Cập nhật dữ liệu khi mở modal hoặc dữ liệu thay đổi
  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name || "",
        description: initialData.description || "",
        roomNumber: initialData.roomNumber || "",
        type: initialData.type || DepartmentType.CONSULTATION,
      });
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
        onSubmit={(e) => {
          e.preventDefault();
          const validation = form.validate();
          if (!validation.hasErrors) {
            onSubmit(form.values);
            onClose();
          }
        }}
      >
        <TextInput
          label="Tên phòng ban"
          placeholder="Nhập tên"
          {...form.getInputProps("name")}
          error={form.errors.name}
          required
          disabled={isViewMode}
        />

        <TextInput
          label="Mô tả"
          placeholder="Nhập mô tả"
          {...form.getInputProps("description")}
          error={form.errors.description}
          mt="sm"
          disabled={isViewMode}
        />

        <TextInput
          label="Số phòng"
          placeholder="Nhập số phòng"
          {...form.getInputProps("roomNumber")}
          error={form.errors.roomNumber}
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
          value={form.values.type || ""}
          onChange={(val) => {
            if (val) form.setFieldValue("type", val as DepartmentType);
          }}
          error={form.errors.type}
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
