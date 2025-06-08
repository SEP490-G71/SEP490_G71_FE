import { Modal, TextInput, Button, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { Gender, Level, Specialty } from "../../../enums/Admin/EmployeeEnums";
import { EmployeeRequest } from "../../../types/Admin/Employee/EmployeeTypeRequest";

interface CreateEditStaffModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: EmployeeRequest | null;
  onSubmit: (data: EmployeeRequest) => void;
  isViewMode?: boolean;
}

const CreateEditStaffModal: React.FC<CreateEditStaffModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const form = useForm<EmployeeRequest>({
    initialValues: {
      name: "",
      specialty: Specialty.OTHER,
      level: Level.INTERN,
      phone: "",
      email: "",
      gender: Gender.OTHER,
      dob: "",
      accountId: undefined,
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Tên phải có ít nhất 3 ký tự" : null,
      phone: (value) =>
        !/^\d{10,15}$/.test(value) ? "Số điện thoại không hợp lệ" : null,
      email: (value) =>
        !/^\S+@\S+\.\S+$/.test(value) ? "Email không hợp lệ" : null,
      dob: (value) => (!value ? "Ngày sinh không được để trống" : null),
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
      title={initialData ? "Cập nhật nhân viên" : "Tạo mới nhân viên"}
      size="xl"
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
          label="Họ và tên"
          placeholder="Nhập tên"
          {...form.getInputProps("name")}
          required
          disabled={isViewMode}
        />

        <Select
          label="Chuyên môn"
          data={Object.entries(Specialty).map(([value, label]) => ({
            value,
            label,
          }))}
          {...form.getInputProps("specialty")}
          required
          mt="sm"
          disabled={isViewMode}
        />

        <Select
          label="Cấp bậc"
          data={Object.entries(Level).map(([value, label]) => ({
            value,
            label,
          }))}
          {...form.getInputProps("level")}
          required
          mt="sm"
          disabled={isViewMode}
        />

        <TextInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          {...form.getInputProps("phone")}
          required
          mt="sm"
          disabled={isViewMode}
        />

        <TextInput
          label="Email"
          placeholder="Nhập email"
          {...form.getInputProps("email")}
          required
          mt="sm"
          disabled={isViewMode}
        />

        <Select
          label="Giới tính"
          data={Object.entries(Gender).map(([value, label]) => ({
            value,
            label,
          }))}
          {...form.getInputProps("gender")}
          required
          mt="sm"
          disabled={isViewMode}
        />

        <DateInput
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
          valueFormat="YYYY-MM-DD"
          {...form.getInputProps("dob")}
          required
          disabled={isViewMode}
          size="md"
          styles={{
            icon: {
              width: 20,
              height: 20,
            },
          }}
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

export default CreateEditStaffModal;
