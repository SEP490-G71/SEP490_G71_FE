import { Grid, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect } from "react";

interface Props {
  form: any;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
}

const ExaminationInfoForm = ({
  form,
  doctorId,
  doctorName,
  departmentId,
  departmentName,
}: Props) => {
  useEffect(() => {
    form.setFieldValue("doctor", doctorId);
    form.setFieldValue("department", departmentId);
  }, [doctorId, departmentId]);

  return (
    <Grid gutter="xs">
      <Grid.Col span={4}>
        <DateTimePicker
          label="Ngày khám"
          value={form.values.appointmentDate}
          onChange={(value) => form.setFieldValue("appointmentDate", value)}
          required
        />
      </Grid.Col>

      <Grid.Col span={4}>
        <TextInput
          label="Bác sĩ"
          value={doctorName}
          readOnly
          variant="filled"
          radius="md"
          size="sm"
        />
      </Grid.Col>

      <Grid.Col span={4}>
        <TextInput
          label="Phòng khám"
          value={departmentName}
          readOnly
          variant="filled"
          radius="md"
          size="sm"
        />
      </Grid.Col>
    </Grid>
  );
};

export default ExaminationInfoForm;
