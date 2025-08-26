import { useEffect, useMemo, useRef } from "react";
import {
  Button,
  Modal,
  Text,
  TextInput,
  Group,
  Select,
  Paper,
  Image,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Hospital } from "../../types/Admin/LandingPageAdmin/Hospital";
import useServicePackages from "../../hooks/LangdingPagesAdmin/useServicePackages";

const BANK_CODE = "BIDV"; // ví dụ: "VCB", "MB", "BIDV", ...
const ACCOUNT_NUMBER = "4271030587"; // số tài khoản nhận tiền

const sanitizeCode = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    currencyDisplay: "code",
  }).format(n);

const buildVietQRUrl = (
  amount: number,
  addInfo: string,
  accountName: string
) => {
  const base = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-compact.png`;
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo,
    accountName,
    fixedAmount: "true",
  });
  return `${base}?${params.toString()}`;
};

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
  const {
    servicePackages,
    fetchServicePackages,
    loading: pkgLoading,
  } = useServicePackages();

  // Chỉ fetch gói 1 lần mỗi lần mở modal
  const fetchedThisOpenRef = useRef(false);
  useEffect(() => {
    if (visible && !fetchedThisOpenRef.current) {
      fetchServicePackages();
      fetchedThisOpenRef.current = true;
    }
    if (!visible) fetchedThisOpenRef.current = false;
  }, [visible, fetchServicePackages]);

  const form = useForm<Hospital>({
    initialValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      servicePackageId: servicePackageId || "",
    },
    validate: {
      name: (v) =>
        v.trim().length === 0 ? "Vui lòng nhập tên bệnh viện!" : null,
      code: (v) =>
        v.trim().length === 0
          ? "Vui lòng nhập mã bệnh viện!"
          : /^[a-z0-9]+$/.test(v)
          ? null
          : "Mã chỉ gồm chữ thường không dấu và số (a-z, 0-9), không khoảng trắng/ký tự đặc biệt!",
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Email không hợp lệ!"),
      phone: (v) =>
        /^[0-9]{10}$/.test(v) ? null : "Số điện thoại phải có 10 chữ số!",
      servicePackageId: (v) =>
        !v || v.trim().length === 0 ? "Vui lòng chọn gói dịch vụ!" : null,
    },
  });

  // Lấy gói đã chọn
  const selectedPackage = useMemo(
    () => servicePackages.find((p) => p.id === form.values.servicePackageId),
    [servicePackages, form.values.servicePackageId]
  );

  // Tạo QR URL khi đã có tên BV và gói
  const qrUrl = useMemo(() => {
    if (!form.values.name || !selectedPackage) return "";
    const amount = Number(selectedPackage.price || 0);
    if (!amount || Number.isNaN(amount)) return "";

    const addInfo = `Đã thanh toán thành công gói ${
      selectedPackage.packageName
    } với giá ${formatVND(amount)} cho bệnh viện ${form.values.name}`;

    return buildVietQRUrl(amount, addInfo, form.values.name);
  }, [form.values.name, selectedPackage]);

  const handleSubmit = (values: Hospital) => onOk(values, form.reset);

  return (
    <Modal opened={visible} onClose={onCancel} title="" centered>
      <div
        style={{
          fontWeight: 700,
          paddingBottom: 8,
          borderBottom: "1px solid #e0e0e0",
          fontSize: 20,
          marginBottom: 12,
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
            if (e.key === " ") e.preventDefault();
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
          placeholder={pkgLoading ? "Đang tải..." : "Chọn gói dịch vụ"}
          data={(servicePackages ?? []).map((pkg) => ({
            label: `${pkg.packageName} - ${formatVND(Number(pkg.price || 0))}`,
            value: pkg.id,
          }))}
          {...form.getInputProps("servicePackageId")}
          mb="md"
          disabled={loading || pkgLoading}
          allowDeselect={false}
        />

        {qrUrl && (
          <Paper withBorder p="md" radius="md" mb="md">
            <Text fw={600} mb={8}>
              Mã QR thanh toán gói: {selectedPackage?.packageName} cho bệnh viện{" "}
              {form.values.name}
            </Text>
            <Image src={qrUrl} alt="QR thanh toán VietQR" w={220} />
            <Text size="sm" mt="xs">
              Số tiền: <b>{formatVND(Number(selectedPackage?.price || 0))}</b>
            </Text>
            <Anchor href={qrUrl} target="_blank" rel="noopener" mt="xs">
              Mở ảnh QR trong tab mới
            </Anchor>
          </Paper>
        )}

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
