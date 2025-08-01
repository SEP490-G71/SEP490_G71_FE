import { Modal, TextInput, Select, Button } from "@mantine/core";
import { useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import { usePatientForm } from "../../../hooks/Patient-Management/usePatientForm";
import {
  CreateUpdatePatientRequest,
  Patient,
} from "../../../types/Admin/Patient-Management/PatientManagement";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUpdatePatientRequest) => Promise<boolean>; // ✅ Trả về true nếu thành công
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
  const form = usePatientForm();

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

  const handleSubmit = async (values: typeof form.values) => {
    const payload: CreateUpdatePatientRequest = {
      ...values,
      dob: values.dob ? values.dob.toISOString().split("T")[0] : "",
    };

    const isSuccess = await onSubmit(payload); // ✅ chỉ đóng nếu thành công
    if (isSuccess) {
      onClose();
    }
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
        onSubmit={async (e) => {
          e.preventDefault();
          form.setTouched({
            firstName: true,
            lastName: true,
            dob: true,
            gender: true,
            phone: true,
            email: true,
          });
          const result = form.validate();
          if (!result.hasErrors) {
            await handleSubmit(form.values);
          }
        }}
      >
        <TextInput
          label="Họ"
          placeholder="Nhập họ"
          required
          {...form.getInputProps("lastName")}
          disabled={isViewMode}
        />
        <TextInput
          label="Tên đệm"
          placeholder="Nhập tên đệm"
          {...form.getInputProps("middleName")}
          mt="sm"
          disabled={isViewMode}
        />
        <TextInput
          label="Tên"
          placeholder="Nhập tên"
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
          placeholder="Chọn giới tính"
          required
          data={[
            { value: "MALE", label: "Nam" },
            { value: "FEMALE", label: "Nữ" },
          ]}
          {...form.getInputProps("gender")}
          mt="sm"
          disabled={isViewMode}
        />

        <TextInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          required
          {...form.getInputProps("phone")}
          mt="sm"
          disabled={isViewMode}
        />
        <TextInput
          label="Email"
          placeholder="Nhập email"
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
