import {
  Modal,
  Button,
  NumberInput,
  Group,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { useInvoice } from "../../hooks/invoice/useInvoice";

interface Props {
  opened: boolean;
  onClose: () => void;
  invoiceId: string;
  staffId: string;
  availableServices: MedicalService[];
  onSuccess?: () => void;
}

const EditInvoiceModal = ({
  opened,
  onClose,
  invoiceId,
  staffId,
  availableServices,
  onSuccess,
}: Props) => {
  const [services, setServices] = useState<
    { serviceId: string; quantity: number }[]
  >([]);
  const { updateInvoice, updating } = useInvoice();

  const handleAddService = () => {
    setServices([...services, { serviceId: "", quantity: 1 }]);
  };

  const handleUpdate = async () => {
    const isValid = services.every(
      (s) => s.serviceId.trim() !== "" && s.quantity > 0
    );
    if (!isValid) return alert("Vui lòng chọn đầy đủ dịch vụ và số lượng!");

    try {
      await updateInvoice({ invoiceId, staffId, services });
      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật hóa đơn.");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Cập nhật dịch vụ"
      centered
      size="lg"
    >
      <Stack gap="sm">
        {services.length === 0 && (
          <Text c="dimmed" size="sm">
            Chưa có dịch vụ nào. Nhấn "Thêm dịch vụ" để bắt đầu.
          </Text>
        )}
        {services.map((s, idx) => (
          <Group key={idx} grow align="flex-end">
            <Select
              label="Dịch vụ"
              data={availableServices.map((sv) => ({
                value: sv.id,
                label: `${sv.id} - ${sv.name}`,
              }))}
              value={s.serviceId}
              onChange={(val) =>
                setServices((prev) =>
                  prev.map((item, i) =>
                    i === idx ? { ...item, serviceId: val ?? "" } : item
                  )
                )
              }
              searchable
              placeholder="Chọn dịch vụ"
              required
            />
            <NumberInput
              label="Số lượng"
              value={s.quantity}
              onChange={(val) =>
                setServices((prev) =>
                  prev.map((item, i) =>
                    i === idx ? { ...item, quantity: val as number } : item
                  )
                )
              }
              min={1}
              required
            />
          </Group>
        ))}

        <Group justify="center" mt="sm">
          <Button onClick={handleAddService} variant="light">
            + Thêm dịch vụ
          </Button>
          <Button onClick={handleUpdate} loading={updating} color="cyan">
            Lưu
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditInvoiceModal;
