import { Modal, TextInput, Button, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { Gender, Level, Specialty } from "../../../enums/Admin/StaffsEnums";
import { StaffsRequest } from "../../../types/Admin/Staffs/StaffsTypeRequest";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateDob,
} from "../../utils/validation";

import "dayjs/locale/vi";
import "@mantine/dates/styles.css";

interface CreateEditStaffModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: StaffsRequest | null;
  onSubmit: (data: StaffsRequest) => void;
  isViewMode?: boolean;
}

const CreateEditStaffModal: React.FC<CreateEditStaffModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}) => {
  const form = useForm<StaffsRequest>({
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
      name: (value) => validateName(value ?? ""),
      phone: (value) => validatePhone(value ?? ""),
      email: (value) => validateEmail(value ?? ""),
      dob: (value) => validateDob(value ?? ""),
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
      styles={{
        header: {
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "16px",
        },
        title: {
          color: "white",
          fontWeight: 600,
          width: "100%",
        },
        close: {
          color: "white",
        },
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const isValid = form.validate();
          if (!isValid.hasErrors) {
            onSubmit(form.values);
            onClose();
          }
        }}
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

        <DatePickerInput
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
          valueFormat="YYYY-MM-DD"
          locale="vi"
          {...form.getInputProps("dob")}
          required
          mt="sm"
          disabled={isViewMode}
        />

        {!isViewMode && (
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit" color="blue">
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default CreateEditStaffModal;
