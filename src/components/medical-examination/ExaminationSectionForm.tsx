import { Grid, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect, useMemo } from "react";
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

  useEffect(() => {
    const h = Number(form.values.heightCm);
    const w = Number(form.values.weightKg);
    if (h > 0 && w > 0) {
      const bmi = w / Math.pow(h / 100, 2);
      form.setFieldValue("bmi", Number(bmi.toFixed(1)));
    } else {
      form.setFieldValue("bmi", 0);
    }
  }, [form.values.heightCm, form.values.weightKg]);

  const bmiBorderColorVar = useMemo(() => {
    const bmi = Number(form.values.bmi) || 0;
    if (bmi <= 0) return undefined;
    if (bmi < 18.5) return "var(--mantine-color-red-6)";
    if (bmi < 23) return "var(--mantine-color-green-6)";
    if (bmi < 25) return "var(--mantine-color-yellow-6)";
    if (bmi < 30) return "var(--mantine-color-orange-6)";
    return "var(--mantine-color-red-6)";
  }, [form.values.bmi]);

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
          value={form.values.bmi ? Number(form.values.bmi).toFixed(1) : ""}
          readOnly
          styles={{
            input: {
              fontWeight: 600,
              borderColor: bmiBorderColorVar,
            },
          }}
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
          label="Chẩn đoán"
          placeholder="Nhập chẩn đoán"
          minRows={2}
          autosize
          required
          {...form.getInputProps("diagnosisText")}
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
