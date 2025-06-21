import { Modal, TextInput, Select, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import {
  CreateUpdatePatientRequest,
  Patient,
} from "../../../types/Admin/Patient-Management/PatientManagement";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUpdatePatientRequest) => void;
  initialData?: Patient | null;
  isViewMode?: boolean;
}

export const CreatePatientModal = ({
  opened,
  onClose,
  onSubmit,
  initialData,
  isViewMode = false,
}: Props) => {
  const validateText =
    (label: string, max: number = 100) =>
    (value?: string) => {
      value = value ?? "";
      if (!value.trim()) return `${label} là bắt buộc`;
      if (value.length > max) return `${label} tối đa ${max} ký tự`;
      return null;
    };

  const form = useForm<{
    firstName: string;
    middleName: string;
    lastName: string;
    dob: Date | null;
    gender: "MALE" | "FEMALE";
    phone: string;
    email: string;
  }>({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: null,
      gender: "MALE",
      phone: "",
      email: "",
    },
    validate: {
      firstName: validateText("Tên"),
      middleName: validateText("Tên đệm"),
      lastName: validateText("Họ"),
      dob: (value) => {
        if (!value) return "Ngày sinh là bắt buộc";
        const today = new Date();
        if (value >= today) return "Ngày sinh phải là trong quá khứ";
        return null;
      },
      gender: (value) => (!value ? "Giới tính là bắt buộc" : null),
      phone: (value) => {
        if (!value.trim()) return "Số điện thoại là bắt buộc";
        if (!/^\d{10,15}$/.test(value)) return "SĐT phải từ 10-15 chữ số";
        return null;
      },
      email: (value) => {
        if (!value.trim()) return "Email là bắt buộc";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email không hợp lệ";
        return null;
      },
    },
    validateInputOnChange: true, // hiện lỗi khi người dùng nhập sai ngay lập tức
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        ...initialData,
        dob: initialData.dob ? new Date(initialData.dob) : null,
        gender: initialData.gender as "MALE" | "FEMALE",
      });
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  const handleSubmit = (values: typeof form.values) => {
    const payload: CreateUpdatePatientRequest = {
      ...values,
      dob: values.dob ? values.dob.toISOString().split("T")[0] : "",
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-xl font-bold">
            {initialData ? "Cập nhật thông tin bệnh nhân" : "Tạo mới bệnh nhân"}
          </h2>
          <div className="mt-2 border-b border-gray-300"></div>
        </div>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          form.setTouched({
            firstName: true,
            middleName: true,
            lastName: true,
            dob: true,
            gender: true,
            phone: true,
            email: true,
          });

          const result = form.validate();
          if (!result.hasErrors) {
            handleSubmit(form.values);
          }
        }}
      >
        <TextInput
          label="Họ"
          required
          {...form.getInputProps("lastName")}
          disabled={isViewMode}
        />
        <TextInput
          label="Tên đệm"
          {...form.getInputProps("middleName")}
          mt="sm"
          disabled={isViewMode}
        />
        <TextInput
          label="Tên"
          required
          {...form.getInputProps("firstName")}
          mt="sm"
          disabled={isViewMode}
        />
        <DatePickerInput
          label="Ngày sinh"
          placeholder="dd/mm/yyyy"
          type="default"
          value={form.values.dob}
          onChange={(value) => {
            const parsed = value ? new Date(value) : null;
            form.setFieldValue("dob", parsed);
          }}
          valueFormat="DD/MM/YYYY"
          required
          mt="sm"
          disabled={isViewMode}
          error={form.errors.dob}
        />
        <Select
          label="Giới tính"
          data={[
            { value: "MALE", label: "Nam" },
            { value: "FEMALE", label: "Nữ" },
          ]}
          {...form.getInputProps("gender")}
          mt="sm"
          disabled={isViewMode}
        />
        <TextInput
          label="SĐT"
          required
          {...form.getInputProps("phone")}
          mt="sm"
          disabled={isViewMode}
        />
        <TextInput
          label="Email"
          required
          {...form.getInputProps("email")}
          mt="sm"
          disabled={isViewMode}
        />

        {!isViewMode && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button type="submit">{initialData ? "Cập nhật" : "Tạo"}</Button>
          </div>
        )}
      </form>
    </Modal>
  );
};
