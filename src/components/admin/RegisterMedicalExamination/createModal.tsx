// File: createModal.tsx
import {
  Modal,
  TextInput,
  Grid,
  Select,
  PasswordInput,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import { toast } from "react-toastify";

interface CreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Patient, resetForm: () => void) => void;
}

const initialState: Patient = {
  id: 0,
  maBN: "",
  maLichHen: "",
  name: "",
  phone: "",
  dob: "",
  gender: "",
  account: "",
  address: "",
  maKCB: "",
  stt: "",
  phongKham: "",
  ngayDangKy: "",
  email: "",
  cccd: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export default function CreateModal({
  opened,
  onClose,
  onSubmit,
}: CreateModalProps) {
  const [formData, setFormData] = useState<Patient>(initialState);

  const handleChange = (field: keyof Patient, value: any) => {
    if (field === "dob" && value instanceof Date && !isNaN(value.getTime())) {
      const iso = value.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, dob: iso }));
    } else if (field === "dob" && !value) {
      setFormData((prev) => ({ ...prev, dob: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    console.log("Dữ liệu gửi đi:", formData);
    onSubmit(formData, () => {
      setFormData(initialState);
      toast.success("Đã tạo bệnh nhân mới!");
    });
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
        <Grid gutter="xs">
          <Grid.Col span={6}>
            <TextInput
              label="Họ và tên"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePickerInput
              label="Ngày sinh"
              value={
                formData.dob && !isNaN(Date.parse(formData.dob))
                  ? new Date(formData.dob)
                  : null
              }
              onChange={(value) => handleChange("dob", value)}
              valueFormat="DD/MM/YYYY"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Giới tính"
              data={["Nam", "Nữ", "Không xác định"]}
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="CMT/CCCD"
              value={formData.cccd}
              onChange={(e) => handleChange("cccd", e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Grid.Col>
        </Grid>

        <Divider label="Thông tin tài khoản" mt="md" mb="md" />
        <Grid gutter="xs">
          <Grid.Col span={6}>
            <TextInput
              label="Tài khoản"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <PasswordInput
              label="Mật khẩu"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <PasswordInput
              label="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
