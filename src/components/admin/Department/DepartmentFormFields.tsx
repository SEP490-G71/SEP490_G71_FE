import { Select, TextInput } from "@mantine/core";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";
import {
  DepartmentType,
  DepartmentTypeLabel,
} from "../../../enums/Admin/DepartmentEnums";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export const DepartmentFormFields = ({
  form,
  specializations,
  isViewMode,
  isCreateMode,
}: {
  form: ReturnType<typeof useForm<DepartmentRequest>>;
  specializations: { id: string; name: string }[];
  isViewMode: boolean;
  isCreateMode: boolean;
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
        required
        mt="sm"
        disabled={isViewMode}
        {...form.getInputProps("name")}
      />

      <TextInput
        label="Mô tả"
        placeholder="Nhập mô tả"
        mt="sm"
        disabled={isViewMode}
        {...form.getInputProps("description")}
      />

      <TextInput
        label="Số phòng"
        placeholder="Nhập số phòng"
        required
        mt="sm"
        disabled={isViewMode}
        error={form.errors.roomNumber}
        {...form.getInputProps("roomNumber")}
      />

      <Select
        key={`select-type-${form.values.type ?? "new"}`}
        label="Loại phòng ban"
        placeholder="Chọn loại phòng ban"
        data={Object.values(DepartmentType).map((key) => ({
          value: key,
          label: DepartmentTypeLabel[key],
        }))}
        value={form.values.type ?? ""}
        onChange={(val) => {
          form.setFieldValue("type", (val || "") as DepartmentType);
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

      {isKhamBenh && isCreateMode && (
        <TextInput
          label="Giá mặc định dịch vụ (VNĐ)"
          placeholder="Nhập giá mặc định"
          type="text"
          value={
            form.values.defaultServicePrice > 0
              ? Intl.NumberFormat("vi-VN").format(
                  form.values.defaultServicePrice
                )
              : ""
          }
          onChange={(e) => {
            const raw = e.currentTarget.value.replace(/\D/g, "");
            const numberValue = parseInt(raw || "0", 10);
            form.setFieldValue("defaultServicePrice", numberValue);
          }}
          disabled={isViewMode}
          error={form.errors.defaultServicePrice}
          mt="sm"
          required
        />
      )}
    </>
  );
};

export default DepartmentFormFields;
