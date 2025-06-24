import {
  Modal,
  TextInput,
  Grid,
  Select,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import { useRegisterMedicalExamination } from "../../../hooks/RegisterMedicalExamination/useRegisterMedicalExamination";
import { usePatientForm } from "../../../hooks/Patient-Management/usePatientForm"; // Đã có validate ở đây

interface CreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Patient, resetForm: () => void) => void;
}

export default function CreateModal({
  opened,
  onClose,
  onSubmit,
}: CreateModalProps) {
  const form = usePatientForm();
  const { createPatient } = useRegisterMedicalExamination();

  const handleSubmit = async () => {
    const result = form.validate();
    if (result.hasErrors) return;

    const payload = {
      ...form.values,
      dob: form.values.dob?.toISOString().split("T")[0] || "",
    };

    const createdPatient = await createPatient(payload);
    if (createdPatient) {
      form.reset();
      onClose();
      onSubmit(createdPatient, () => form.reset());
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Thêm bệnh nhân mới"
      size="xl"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Divider label="Thông tin cá nhân" mb="md" />
        <Grid gutter="md">
          {/* Họ - Tên đệm - Tên trên cùng 1 hàng */}
          <Grid.Col span={4}>
            <TextInput
              label="Họ"
              placeholder="Nhập họ"
              required
              {...form.getInputProps("firstName")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Tên đệm"
              placeholder="Nhập tên đệm"
              required
              {...form.getInputProps("middleName")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Tên"
              placeholder="Nhập tên"
              required
              {...form.getInputProps("lastName")}
            />
          </Grid.Col>

          {/* Ngày sinh - Giới tính */}
          <Grid.Col span={6}>
            <DatePickerInput
              label="Ngày sinh"
              placeholder="dd/mm/yyyy"
              value={form.values.dob}
              onChange={(value) =>
                form.setFieldValue("dob", value ? new Date(value) : null)
              }
              valueFormat="DD/MM/YYYY"
              required
              error={form.errors.dob}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Giới tính"
              placeholder="Chọn giới tính"
              required
              data={[
                { value: "MALE", label: "Nam" },
                { value: "FEMALE", label: "Nữ" },
              ]}
              {...form.getInputProps("gender")}
            />
          </Grid.Col>

          {/* Số điện thoại - Email */}
          <Grid.Col span={6}>
            <TextInput
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              required
              {...form.getInputProps("phone")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Email"
              placeholder="Nhập email"
              required
              {...form.getInputProps("email")}
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit">Tạo</Button>
        </Group>
      </form>
    </Modal>
  );
}
