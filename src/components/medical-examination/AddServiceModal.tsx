import { useEffect, useState } from "react";
import { Box, Button, Group, Loader, Modal, Stack, Text } from "@mantine/core";
import ServiceTable from "./MedicalServiceTable";

export interface AddServiceItem {
  serviceId: string;
  quantity: number;
}

interface ServiceRow {
  id: number;
  serviceId: string | null;
  quantity: number;
  serviceCode?: string;
  name?: string;
  price?: number;
  discount?: number;
  vat?: number;
  departmentName?: string;
  total?: number;
  isDefault?: boolean;
}

interface OptionGroup {
  group: string;
  items: { value: string; label: string }[];
}

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: (
    services: AddServiceItem[],
    note?: string
  ) => Promise<void> | void;

  medicalServices: any[];
  serviceOptions: OptionGroup[];
  nonDefaultServiceOptions: OptionGroup[];
  defaultServiceIds: string[];

  allowSelectDefaultServices?: boolean;
  loading?: boolean;
}

const AddServiceModal = ({
  opened,
  onClose,
  onConfirm,
  medicalServices,
  serviceOptions,
  nonDefaultServiceOptions,
  defaultServiceIds,
  allowSelectDefaultServices = true,
  loading = false,
}: Props) => {
  const [rows, setRows] = useState<ServiceRow[]>([
    { id: 1, serviceId: null, quantity: 1 },
  ]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (opened) {
      setRows([{ id: 1, serviceId: null, quantity: 1 }]);
      setNote("");
    }
  }, [opened]);

  const handleConfirm = async () => {
    const payload = rows
      .filter((r) => r.serviceId && (r.quantity ?? 0) > 0)
      .map((r) => ({
        serviceId: r.serviceId as string,
        quantity: Number(r.quantity || 1),
      }));

    await onConfirm(payload, note?.trim() || undefined);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Thêm dịch vụ mới"
      size="80%"
      centered
      // Tắt ScrollArea mặc định để flex làm việc đúng
      scrollAreaComponent={Box}
      styles={{
        content: {
          transform: "translateY(-40px)",
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
        },
        body: {
          paddingTop: "1rem",
          paddingBottom: "1rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        },
      }}
    >
      <Stack
        gap="sm"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Text c="dimmed" size="sm">
          Chọn dịch vụ cần bổ sung cho hồ sơ đang khám. Bạn có thể thêm nhiều
          dòng.
        </Text>

        {/* Phần bảng có thể để overflow auto nếu danh sách dài */}
        <Box style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <ServiceTable
            serviceRows={rows}
            setServiceRows={setRows}
            medicalServices={medicalServices}
            serviceOptions={serviceOptions}
            nonDefaultServiceOptions={nonDefaultServiceOptions}
            defaultServiceIds={defaultServiceIds}
            editable={true}
            showDepartment={true}
            allowSelectDefaultServices={allowSelectDefaultServices}
          />
        </Box>

        {/* Footer cố định dưới cùng, canh phải */}
        <Group justify="flex-end" mt="auto">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Huỷ
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? <Loader size="sm" /> : "Xác nhận"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddServiceModal;
