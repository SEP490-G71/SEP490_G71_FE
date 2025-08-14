import {
  TextInput,
  Button,
  Paper,
  Title,
  Select,
  LoadingOverlay,
  Grid,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useUserInfo } from "../../../hooks/auth/useUserInfo";
import axiosInstance from "../../../services/axiosInstance";
import { RoleLabels, RoleType } from "../../../enums/Role/RoleType";
import { toast } from "react-toastify";
import { ChangePasswordForm } from "../../../components/header/ChangePasswordForm";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

export default function EditProfilePageForUser() {
  const { userInfo } = useUserInfo();
  const isPatient = userInfo?.roles.includes(RoleType.PATIENT);
  const userId = userInfo?.userId || "";
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "MALE",
      phone: "",
      email: "",
      role: "",
    },
  });

  const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get(
        isPatient ? `/patients/${userId}` : `/staffs/${userId}`
      );
      const data = res.data?.result;

      form.setValues({
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        dob: data.dob || "",
        gender: data.gender || "MALE",
        phone: data.phone || "",
        email: data.email || "",
        role: data.roles?.[0] || "",
      });
    } catch (err) {
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const endpoint = isPatient ? `/patients/${userId}` : `/staffs/${userId}`;
      const payload: any = { ...values };

      if (!isPatient) {
        payload.roleNames = [values.role];
      }

      await axiosInstance.put(endpoint, payload);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chỉnh sửa thông tin cá nhân */}
      <Paper shadow="md" radius="md" p="xl" withBorder pos="relative">
        <LoadingOverlay visible={loading} />
        <Title order={3} mb="md">
          Chỉnh sửa thông tin cá nhân
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid mb="md">
            <Grid.Col span={4}>
              <TextInput
                label="Họ"
                {...form.getInputProps("firstName")}
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Tên đệm"
                {...form.getInputProps("middleName")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Tên"
                {...form.getInputProps("lastName")}
                withAsterisk
              />
            </Grid.Col>
          </Grid>

          <Grid mb="md">
            <Grid.Col span={4}>
              <DateInput
                label="Ngày sinh"
                {...form.getInputProps("dob")}
                valueFormat="DD/MM/YYYY"
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Giới tính"
                data={GENDER_OPTIONS}
                {...form.getInputProps("gender")}
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Số điện thoại"
                {...form.getInputProps("phone")}
                withAsterisk
              />
            </Grid.Col>
          </Grid>

          <Grid mb="md">
            <Grid.Col span={6}>
              <TextInput
                label="Email"
                {...form.getInputProps("email")}
                withAsterisk
              />
            </Grid.Col>
            {!isPatient && (
              <Grid.Col span={6}>
                <TextInput
                  label="Vai trò"
                  value={
                    RoleLabels[form.values.role as RoleType] || form.values.role
                  }
                  readOnly
                  disabled
                />
              </Grid.Col>
            )}
          </Grid>

          <Button type="submit" mt="lg">
            Lưu thay đổi
          </Button>
        </form>
      </Paper>

      {/* Đổi mật khẩu */}
      <ChangePasswordForm />
    </>
  );
}
