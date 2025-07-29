// components/ChangePasswordForm.tsx
import {
  Button,
  Paper,
  Title,
  PasswordInput,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { useUserInfo } from "../../hooks/auth/useUserInfo";

export const ChangePasswordForm = () => {
  const { userInfo } = useUserInfo();
  const accountId = userInfo?.accountId || "";
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validate: {
      oldPassword: (value) =>
        value.length < 8 ? "Mật khẩu cũ phải từ 8 ký tự" : null,
      newPassword: (value) =>
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(value)
          ? null
          : "Mật khẩu mới cần có chữ hoa, số và ký tự đặc biệt",
      confirmNewPassword: (value, values) =>
        value !== values.newPassword ? "Mật khẩu xác nhận không khớp" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/accounts/change-password/${accountId}`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="md" radius="md" p="xl" withBorder pos="relative" mt="xl">
      <LoadingOverlay visible={loading} />
      <Title order={3} mb="md">
        Đổi mật khẩu
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput
          label="Mật khẩu cũ"
          {...form.getInputProps("oldPassword")}
          withAsterisk
          mb="md"
        />
        <PasswordInput
          label="Mật khẩu mới"
          {...form.getInputProps("newPassword")}
          withAsterisk
          mb="md"
        />
        <PasswordInput
          label="Xác nhận mật khẩu mới"
          {...form.getInputProps("confirmNewPassword")}
          withAsterisk
          mb="md"
        />
        <Button type="submit" mt="lg">
          Lưu thay đổi
        </Button>
      </form>
    </Paper>
  );
};
