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
      firstName: "",
      middleName: "",
      lastName: "",
      fullName: "",
      specialty: Specialty.OTHER,
      level: Level.INTERN,
      phone: "",
      email: "",
      gender: Gender.OTHER,
      dob: "",
    },
    validate: {
      firstName: (value) => validateName(value ?? ""),
      lastName: (value) => validateName(value ?? ""),
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
        content: {
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        // ẩn scrollbar trong Chrome
        inner: {
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { hasErrors } = form.validate();
          if (!hasErrors) {
            console.log("Form data:", form.values);
            onSubmit(form.values);
            console.log("Form data2:", form.values);
            onClose();
          }
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput
            label="Họ"
            placeholder="Nhập họ"
            {...form.getInputProps("firstName")}
            required
            disabled={isViewMode}
          />
          <TextInput
            label="Tên đệm"
            placeholder="Nhập tên đệm"
            {...form.getInputProps("middleName")}
            disabled={isViewMode}
          />
          <TextInput
            label="Tên"
            placeholder="Nhập tên"
            {...form.getInputProps("lastName")}
            required
            disabled={isViewMode}
          />
        </div>

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
