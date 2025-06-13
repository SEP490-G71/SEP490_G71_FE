import {
  Button,
  Modal,
  PasswordInput,
  TextInput,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";

interface LoginForm {
  username: string;
  password: string;
}

const LoginModal = ({
  visible,
  onOk,
  onCancel,
  loading,
}: {
  visible: boolean;
  onOk: (values: LoginForm, resetForm: () => void) => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const form = useForm<LoginForm>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (!value ? "Vui lòng nhập tài khoản" : null),
      password: (value) => (!value ? "Vui lòng nhập mật khẩu" : null),
    },
  });

  const handleSubmit = (values: LoginForm) => {
    onOk(values, form.reset);
  };

  return (
    <Modal opened={visible} onClose={onCancel} title="" centered>
      <div
        style={{
          fontWeight: 700,
          paddingBottom: 8,
          borderBottom: "1px solid #e0e0e0",
          fontSize: "20px",
          marginBottom: "12px",
        }}
      >
        Đăng nhập bệnh viện
      </div>

      <Text mb="md">Nhập thông tin đăng nhập của bạn</Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email hoặc Tên đăng nhập"
          placeholder="example@medsoft.vn"
          {...form.getInputProps("username")}
          mb="sm"
          required
          disabled={loading}
        />
        <PasswordInput
          label="Mật khẩu"
          placeholder="••••••••"
          {...form.getInputProps("password")}
          mb="md"
          required
          disabled={loading}
        />

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" loading={loading}>
            Đăng nhập
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default LoginModal;
