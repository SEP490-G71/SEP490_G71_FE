import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Paper,
  Grid,
  Group,
  Loader,
  Select,
} from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { PaginationSizeInput } from "../../../components/admin/settings/PaginationSizeInput";

// Kiểu dữ liệu cho danh sách ngân hàng
interface BankOption {
  value: string;
  label: string;
}

export const SettingAdminPage: React.FC = () => {
  const { setting, loading, updateSetting } = useSettingAdminService();
  const [bankOptions, setBankOptions] = useState<BankOption[]>([]);
  const [banksLoading, setBanksLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      hospitalName: "",
      hospitalPhone: "",
      hospitalAddress: "",
      hospitalEmail: "",
      bankAccountNumber: "",
      bankCode: "",
      paginationSizeList: [] as number[],
    },
    validate: {
      hospitalName: (v) => (v ? null : "Thông tin bắt buộc"),
      hospitalPhone: (v) => (v ? null : "Thông tin bắt buộc"),
      hospitalAddress: (v) => (v ? null : "Thông tin bắt buộc"),
      bankAccountNumber: (v) => (v ? null : "Thông tin bắt buộc"),
      bankCode: (v) => (v ? null : "Vui lòng chọn ngân hàng"),
      hospitalEmail: (v) => (v && !isEmail(v) ? "Email không hợp lệ" : null),
      paginationSizeList: (values) =>
        values.length === 0 || values.some((v) => v < 1 || v > 200)
          ? "Giá trị phải từ 1 đến 200"
          : null,
    },
  });

  useEffect(() => {
    if (setting) {
      form.setValues({
        ...setting,
        hospitalEmail: setting.hospitalEmail ?? "",
      });
    }
  }, [setting]);

  useEffect(() => {
    async function fetchBanks() {
      setBanksLoading(true);
      try {
        const res = await fetch("/vietqr-banks.json");
        const data: { bank_code: string; bank_name: string }[] =
          await res.json();
        setBankOptions(
          data
            .sort((a, b) => a.bank_name.localeCompare(b.bank_name))
            .map((b) => ({
              value: b.bank_code,
              label: `${b.bank_name} (${b.bank_code})`,
            }))
        );
      } catch (err) {
        console.error("Không lấy được danh sách ngân hàng", err);
      } finally {
        setBanksLoading(false);
      }
    }
    fetchBanks();
  }, []);

  const handleSubmit = (values: typeof form.values) => {
    updateSetting({
      ...values,
      paginationSizeList: values.paginationSizeList.map(Number),
    });
  };

  if (loading) return <Loader className="mx-auto mt-10" />;

  return (
    <div className="w-full px-8 py-6">
      <h1 className="text-2xl font-bold mb-4">Cài đặt hệ thống</h1>
      <Paper shadow="xs" radius="md" p="lg" withBorder className="w-full">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Tên bệnh viện *"
                placeholder="Nhập tên bệnh viện"
                {...form.getInputProps("hospitalName")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Số điện thoại *"
                placeholder="Nhập số điện thoại"
                {...form.getInputProps("hospitalPhone")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Địa chỉ *"
                placeholder="Nhập địa chỉ"
                {...form.getInputProps("hospitalAddress")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Email bệnh viện"
                placeholder="Nhập email (nếu có)"
                {...form.getInputProps("hospitalEmail")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Số tài khoản *"
                placeholder="Nhập số tài khoản"
                {...form.getInputProps("bankAccountNumber")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Ngân hàng *"
                placeholder={banksLoading ? "Đang tải..." : "Chọn ngân hàng"}
                data={bankOptions}
                searchable
                {...form.getInputProps("bankCode")}
                disabled={banksLoading}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <PaginationSizeInput
                values={form.values.paginationSizeList
                  .slice()
                  .sort((a, b) => a - b)}
                onChange={(val) =>
                  form.setFieldValue("paginationSizeList", val)
                }
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="xl">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Lưu thay đổi
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};

export default SettingAdminPage;
