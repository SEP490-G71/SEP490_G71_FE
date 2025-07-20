import { Modal, TextInput, Button, MultiSelect, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { Gender } from "../../../enums/Admin/StaffsEnums";
import { StaffsRequest } from "../../../types/Admin/Staffs/StaffsTypeRequest";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateDob,
} from "../../utils/validation";

import "dayjs/locale/vi";
import "@mantine/dates/styles.css";
import { RoleLabels } from "../../../enums/Role/Role";
import { toast } from "react-toastify";

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
      phone: "",
      email: "",
      gender: Gender.OTHER,
      dob: "",
      roleNames: [],
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
      title={
        <div>
          <h2 className="text-xl font-bold">
            {isViewMode
              ? "Xem Permission"
              : initialData
              ? "Cập nhật nhân viên"
              : "Tạo nhân viên mới"}
          </h2>
          <div className="mt-2 border-b border-gray-300"></div>
        </div>
      }
      size="xl"
      radius="md"
      yOffset={90}
      styles={{
        title: {
          fontWeight: 600,
          width: "100%",
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
        onSubmit={async (e) => {
          e.preventDefault();
          const { hasErrors } = form.validate();
          if (!hasErrors) {
            try {
              await onSubmit(form.values); // nếu lỗi, throw ở đây
              onClose(); // chỉ gọi nếu không lỗi
            } catch (err: any) {
              const resultErrors = err?.response?.data?.result;

              const messageMap: Record<string, string> = {
                email: "Email đã tồn tại",
                phone: "Số điện thoại đã tồn tại",
                gender: "Vui lòng chọn giới tính",
                roleNames: "Vui lòng chọn vai trò",
              };

              if (Array.isArray(resultErrors)) {
                resultErrors.forEach(
                  (e: { field: string; message: string }) => {
                    const field = e.field as keyof StaffsRequest;
                    const translated = messageMap[field] || e.message;
                    form.setFieldError(field, translated);
                  }
                );
              } else {
                toast.error("❗ Đã xảy ra lỗi không xác định");
                console.error("Submit error in modal", err);
              }
            }
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

        <MultiSelect
          label="Vai trò"
          placeholder="Chọn vai trò"
          data={Object.entries(RoleLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          {...form.getInputProps("roleNames")}
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
          placeholder="Chọn giới tính"
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
          valueFormat="DD/MM/YYYY"
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
