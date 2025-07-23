import { Grid, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect } from "react";
import { UseFormReturnType } from "@mantine/form";

interface Props {
  form: UseFormReturnType<any>;
  doctorId: string;
  doctorName: string;
  roomNumber: string;
  departmentId: string;
  departmentName: string;
}

const ExaminationSectionForm = ({
  form,
  doctorId,
  doctorName,
  roomNumber,
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
          value={`${roomNumber} - ${departmentName}`}
          readOnly
          variant="filled"
          radius="md"
          size="sm"
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="Nhiệt độ (°C)"
          type="number"
          placeholder="36.5"
          {...form.getInputProps("temperature")}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="Nhịp thở (L/P)"
          type="number"
          placeholder="16"
          {...form.getInputProps("respiratoryRate")}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="Huyết áp (mmHg)"
          placeholder="120/80"
          {...form.getInputProps("bloodPressure")}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="Mạch (L/P)"
          type="number"
          placeholder="70"
          {...form.getInputProps("heartRate")}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="Chiều cao (cm)"
          type="number"
          placeholder="170"
          {...form.getInputProps("heightCm")}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="Cân nặng (kg)"
          type="number"
          placeholder="60"
          {...form.getInputProps("weightKg")}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="BMI"
          type="number"
          placeholder="20.7"
          {...form.getInputProps("bmi")}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <TextInput
          label="SpO2 (%)"
          type="number"
          placeholder="98"
          {...form.getInputProps("spo2")}
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <Textarea
          label="Triệu chứng"
          minRows={2}
          autosize
          {...form.getInputProps("symptoms")}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Textarea
          label="Ghi chú"
          minRows={2}
          autosize
          {...form.getInputProps("notes")}
        />
      </Grid.Col>
    </Grid>
  );
};

export default ExaminationSectionForm;
