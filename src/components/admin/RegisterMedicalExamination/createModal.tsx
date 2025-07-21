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
import { usePatientForm } from "../../../hooks/Patient-Management/usePatientForm";

interface CreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Patient>, resetForm: () => void) => void;
}

export default function CreateModal({
  opened,
  onClose,
  onSubmit,
}: CreateModalProps) {
  const form = usePatientForm();

  const handleSubmit = async () => {
    const result = form.validate();
    if (result.hasErrors) return;

    const payload = {
      ...form.values,
      dob: form.values.dob?.toISOString().split("T")[0] || "",
    };

    onSubmit(payload, () => form.reset());
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-xl font-bold">Tạo bệnh nhân mới</h2>
          <div className="mt-2 border-b border-gray-300"></div>
        </div>
      }
      size="xl"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Divider label="Thông tin bệnh nhân" mb="md" />
        <Grid gutter="md">
          {/* Họ - Tên đệm - Tên */}
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
