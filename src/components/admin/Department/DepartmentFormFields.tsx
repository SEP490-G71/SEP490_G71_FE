import { Select, TextInput } from "@mantine/core";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";
import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export const DepartmentFormFields = ({
  form,
  specializations,
  isViewMode,
}: {
  form: ReturnType<typeof useForm<Partial<DepartmentRequest>>>;
  specializations: { id: string; name: string }[];
  isViewMode: boolean;
}) => {
  useEffect(() => {
    console.log("Department type:", form.values.type);

    if (form.values.type !== DepartmentType.CONSULTATION) {
      form.setFieldValue("specializationId", "");
    }
  }, [form.values.type]);

  return (
    <>
      <TextInput
        label="Tên phòng ban"
        {...form.getInputProps("name")}
        required
        disabled={isViewMode}
      />
      <TextInput
        label="Mô tả"
        {...form.getInputProps("description")}
        mt="sm"
        disabled={isViewMode}
      />
      <TextInput
        label="Số phòng"
        {...form.getInputProps("roomNumber")}
        required
        mt="sm"
        disabled={isViewMode}
      />
      <Select
        label="Loại phòng"
        data={Object.entries(DepartmentType).map(([value, label]) => ({
          value,
          label,
        }))}
        value={form.values.type ?? ""}
        onChange={(val) => {
          console.log("Selected Department Type:", val);
          form.setFieldValue("type", val as DepartmentType | undefined);
        }}
        error={form.errors.type}
        mt="sm"
        required
        clearable
        disabled={isViewMode}
      />

      <Select
        label="Chuyên khoa"
        value={form.values.specializationId || ""}
        onChange={(value) =>
          form.setFieldValue("specializationId", value ?? "")
        }
        data={specializations.map((s) => ({
          value: s.id,
          label: s.name,
        }))}
        clearable
        disabled={
          form.values.type !== DepartmentType.CONSULTATION || isViewMode
        }
      />
    </>
  );
};

export default DepartmentFormFields;
