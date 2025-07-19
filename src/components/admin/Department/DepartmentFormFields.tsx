import { Select, TextInput } from "@mantine/core";
import { DepartmentRequest } from "../../../types/Admin/Department/DepartmentTypeRequest";
import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";
import { useForm } from "@mantine/form";

export const DepartmentFormFields = ({
  form,
  specializations,
  isViewMode,
}: {
  form: ReturnType<typeof useForm<Partial<DepartmentRequest>>>;
  specializations: { id: string; name: string }[];
  isViewMode: boolean;
}) => (
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
      value={form.values.type ?? null}
      onChange={(val) =>
        form.setFieldValue("type", val as DepartmentType | undefined)
      }
      error={form.errors.type}
      mt="sm"
      required
      clearable
      disabled={isViewMode}
    />
    <Select
      label="Chuyên khoa"
      data={specializations.map((s) => ({
        value: s.id,
        label: s.name,
      }))}
      value={form.values.specializationId ?? ""}
      onChange={(val) => form.setFieldValue("specializationId", val ?? "")}
      mt="sm"
      disabled={isViewMode}
    />
  </>
);

export default DepartmentFormFields;
