import { Select, TextInput } from "@mantine/core";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";
import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export const DepartmentFormFields = ({
  form,
  specializations,
  isViewMode,
}: {
  form: ReturnType<typeof useForm<DepartmentRequest>>;
  specializations: { id: string; name: string }[];
  isViewMode: boolean;
}) => {
  const [isKhamBenh, setIsKhamBenh] = useState(false);

  useEffect(() => {
    setIsKhamBenh(form.values.type === ("CONSULTATION" as DepartmentType));
  }, [form.values.type]);

  return (
    <>
      <TextInput
        label="Tên phòng ban"
        placeholder="Nhập tên phòng ban"
        {...form.getInputProps("name")}
        mt="sm"
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
        required
        mt="sm"
        disabled={isViewMode}
      />

      <Select
        label="Loại phòng ban"
        placeholder="Chọn loại phòng ban"
        data={Object.entries(DepartmentType).map(([key, value]) => ({
          value: key, // Lưu key vào DB: "CONSULTATION", "LABORATORY", ...
          label: value, // Hiển thị tiếng Việt
        }))}
        value={form.values.type || ""}
        onChange={(val) => {
          form.setFieldValue("type", (val || "") as DepartmentType);
          if (val !== "CONSULTATION") {
            form.setFieldValue("specializationId", "");
          }
        }}
        error={form.errors.type}
        mt="sm"
        required
        clearable={!isViewMode}
        disabled={isViewMode}
      />

      {isKhamBenh && (
        <Select
          label="Chuyên khoa"
          placeholder="Chọn chuyên khoa"
          data={specializations.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
          value={form.values.specializationId || ""}
          onChange={(val) => form.setFieldValue("specializationId", val || "")}
          error={form.errors.specializationId}
          clearable
          disabled={isViewMode}
          mt="sm"
          required
        />
      )}
    </>
  );
};

export default DepartmentFormFields;
