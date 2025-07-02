import { Grid, Select } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

interface Props {
  form: any; // useForm instance
  doctorOptions: { value: string; label: string }[];
  departmentOptions: { value: string; label: string }[];
  staffLoading: boolean;
  departmentLoading: boolean;
}

const ExaminationInfoForm = ({
  form,
  doctorOptions,
  departmentOptions,
  staffLoading,
  departmentLoading,
}: Props) => {
  return (
    <Grid gutter="xs">
      <Grid.Col span={4}>
        <DateTimePicker label="Ngày khám" value={new Date()} required />
      </Grid.Col>

      <Grid.Col span={4}>
        <Select
          label="Bác sĩ"
          placeholder={staffLoading ? "Đang tải..." : "Chọn bác sĩ"}
          data={doctorOptions}
          searchable
          disabled={staffLoading || !form.values.department}
          required
          {...form.getInputProps("doctor")}
        />
      </Grid.Col>

      <Grid.Col span={4}>
        <Select
          label="Phòng khám"
          placeholder={departmentLoading ? "Đang tải..." : "Chọn phòng khám"}
          data={departmentOptions}
          searchable
          disabled={departmentLoading}
          required
          {...form.getInputProps("department")}
        />
      </Grid.Col>
    </Grid>
  );
};

export default ExaminationInfoForm;
