import { Button, Modal, Text, TextInput, Title, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Hospital } from "../../types/Hospital";

const RegisterModal = ({
  visible,
  onOk,
  onCancel,
  loading,
}: {
  visible: boolean;
  onOk: (values: Hospital) => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const form = useForm<Hospital>({
    initialValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập tên bệnh viện!" : null,
      code: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập mã bệnh viện!" : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Email không hợp lệ!",
      phone: (value) =>
        /^[0-9]{10}$/.test(value) ? null : "Số điện thoại phải có 10 chữ số!",
    },
  });

  const handleSubmit = (values: Hospital) => {
    onOk(values);
    form.reset();
  };

  return (
    <Modal
      opened={visible}
      onClose={onCancel}
      title={
        <Title
          order={5}
          style={{
            fontWeight: 700,
            paddingBottom: 8,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          Đăng ký dùng thử Medsoft
        </Title>
      }
      centered
    >
      <Text mb="md">Vui lòng nhập thông tin của bạn để đăng ký dùng thử.</Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={
            <span>
              Tên bệnh viện <span style={{ color: "red" }}>*</span>
            </span>
          }
          placeholder="VD: Bệnh viện Bạch Mai"
          {...form.getInputProps("name")}
          mb="sm"
        />

        <TextInput
          label={
            <span>
              Mã bệnh viện <span style={{ color: "red" }}>*</span>
            </span>
          }
          placeholder="VD: thuduc, bachmai"
          {...form.getInputProps("code")}
          mb="sm"
        />

        <TextInput
          label={
            <span>
              Email <span style={{ color: "red" }}>*</span>
            </span>
          }
          placeholder="VD: example@gmail.com"
          {...form.getInputProps("email")}
          mb="sm"
        />

        <TextInput
          label={
            <span>
              Số điện thoại <span style={{ color: "red" }}>*</span>
            </span>
          }
          placeholder="VD: 0123456789"
          {...form.getInputProps("phone")}
          mb="md"
        />

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" loading={loading}>
            Gửi đăng ký
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default RegisterModal;
