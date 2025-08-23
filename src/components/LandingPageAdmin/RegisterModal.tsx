import { useEffect } from "react";
import { Button, Modal, Text, TextInput, Group, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Hospital } from "../../types/Admin/LandingPageAdmin/Hospital";
import useServicePackages from "../../hooks/LangdingPagesAdmin/useServicePackages";

const sanitizeCode = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

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

      code: (value) => {
        if (value.trim().length === 0) return "Vui lòng nhập mã bệnh viện!";
        return /^[a-z0-9]+$/.test(value)
          ? null
          : "Mã chỉ gồm chữ thường không dấu và số (a-z, 0-9), không khoảng trắng/ký tự đặc biệt!";
      },

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

  useEffect(() => {
    if (visible && servicePackages.length === 0) {
      fetchServicePackages();
    }
  }, [visible, fetchServicePackages, servicePackages.length]);

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
              Tên bệnh viện <span style={{ color: "red" }}></span>
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
              Mã bệnh viện <span style={{ color: "red" }}></span>
            </span>
          }
          placeholder="VD: thuduc, bachmai, bv123"
          {...form.getInputProps("code")}
          value={form.values.code}
          onChange={(e) =>
            form.setFieldValue("code", sanitizeCode(e.currentTarget.value))
          }
          onKeyDown={(e) => {
            if (e.key === " ") e.preventDefault(); // chặn khoảng trắng
          }}
          autoComplete="off"
          inputMode="text"
          spellCheck={false}
          description="Chỉ cho phép chữ thường không dấu và số (a-z, 0-9); không khoảng trắng, không ký tự đặc biệt."
          mb="sm"
          required
          disabled={loading}
        />

        <TextInput
          label={
            <span>
              Email <span style={{ color: "red" }}></span>
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
              Số điện thoại <span style={{ color: "red" }}></span>
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
          data={(servicePackages ?? []).map((pkg) => ({
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
