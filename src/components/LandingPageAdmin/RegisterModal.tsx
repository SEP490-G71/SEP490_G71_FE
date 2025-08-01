import { useEffect } from "react";
import { Button, Modal, Text, TextInput, Group, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Hospital } from "../../types/Admin/LandingPageAdmin/Hospital";
import useServicePackages from "../../hooks/LangdingPagesAdmin/useServicePackages";

const RegisterModal = ({
  visible,
  onOk,
  onCancel,
  loading,
  servicePackageId,
}: {
  visible: boolean;
  onOk: (values: Hospital, resetForm: () => void) => void;
  onCancel: () => void;
  loading: boolean;
  servicePackageId?: string;
}) => {
  const { servicePackages, fetchServicePackages } = useServicePackages();

  const form = useForm<Hospital>({
    initialValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      servicePackageId: servicePackageId || "",
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
      servicePackageId: (value) =>
        !value || value.trim().length === 0
          ? "Vui lòng chọn gói dịch vụ!"
          : null,
    },
  });

  // 📝 Lấy gói dịch vụ khi modal mở
  useEffect(() => {
    if (visible) fetchServicePackages();
  }, [visible]);

  const handleSubmit = (values: Hospital) => {
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
        Đăng ký dùng thử Medsoft
      </div>

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
          required
          disabled={loading}
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
          required
          disabled={loading}
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
          required
          disabled={loading}
        />
        <TextInput
          label={
            <span>
              Số điện thoại <span style={{ color: "red" }}>*</span>
            </span>
          }
          placeholder="VD: 0123456789"
          {...form.getInputProps("phone")}
          mb="sm"
          required
          disabled={loading}
        />

        <Select
          label={
            <span>
              Gói đăng ký <span style={{ color: "red" }}>*</span>
            </span>
          }
          placeholder="Chọn gói dịch vụ"
          data={servicePackages.map((pkg) => ({
            label: `${pkg.packageName} - ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              currencyDisplay: "code",
            }).format(pkg.price)}`,
            value: pkg.id,
          }))}
          {...form.getInputProps("servicePackageId")}
          mb="md"
          disabled={loading}
        />

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onCancel} disabled={loading}>
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
