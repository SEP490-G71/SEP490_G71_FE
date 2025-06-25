import { Modal, Button, NumberInput, Select, Table, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { useInvoice } from "../../hooks/invoice/useInvoice";

interface Props {
  opened: boolean;
  onClose: () => void;
  invoiceId: string;
  staffId: string;
  availableServices: MedicalService[];
  invoiceItems: {
    serviceId: string;
    quantity: number;
  }[];
  onSuccess?: () => void;
}

const EditInvoiceModal = ({
  opened,
  onClose,
  invoiceId,
  staffId,
  availableServices,
  invoiceItems,
  onSuccess,
}: Props) => {
  const [services, setServices] = useState<
    { serviceId: string; quantity: number }[]
  >([]);
  const { updateInvoice, updating } = useInvoice();

  useEffect(() => {
    if (opened) {
      const loaded = invoiceItems.map((item) => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
      }));
      setServices([...loaded, { serviceId: "", quantity: 1 }]);
    }
  }, [opened, invoiceItems]);

  const handleAddService = () => {
    setServices([...services, { serviceId: "", quantity: 1 }]);
  };

  const handleRemoveService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    const validServices = services.filter((s) => s.serviceId.trim() !== "");
    const isValid = validServices.every((s) => s.quantity > 0);

    if (!isValid || validServices.length === 0) {
      alert("Vui lòng chọn đầy đủ dịch vụ và số lượng!");
      return;
    }

    try {
      await updateInvoice({ invoiceId, staffId, services: validServices });
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
      size="xl"
      title={
        <div>
          <h2 className="text-xl font-bold">Cập nhật dịch vụ</h2>
          <div className="mt-2 border-b border-gray-300" />
        </div>
      }
    >
      <div className="overflow-x-auto mt-4">
        <Table
          striped
          withColumnBorders
          className="min-w-full border border-gray-300 text-sm"
        >
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 text-center">STT</th>
              <th className="p-2 text-center">Mã DV</th>
              <th className="p-2">Tên DV</th>
              <th className="p-2 text-center">SL</th>
              <th className="p-2 text-right">Đơn giá</th>
              <th className="p-2 text-center">VAT (%)</th>
              <th className="p-2 text-right">Thành tiền</th>
              <th className="p-2 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, idx) => {
              const selected = availableServices.find(
                (sv) => sv.id === s.serviceId
              );
              const price = selected?.price ?? 0;
              const vat = selected?.vat ?? 0;
              const total = price * s.quantity * (1 + vat / 100);

              return (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2 text-center">
                    {selected?.serviceCode ?? "-"}
                  </td>
                  <td className="p-2">
                    <Select
                      data={availableServices.map((sv) => ({
                        value: sv.id,
                        label: `${sv.name} (${sv.serviceCode})`,
                      }))}
                      value={s.serviceId}
                      onChange={(val) =>
                        setServices((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, serviceId: val ?? "" } : item
                          )
                        )
                      }
                      placeholder="Chọn dịch vụ"
                      searchable
                      required
                      size="xs"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <div className="w-[80px] mx-auto">
                      <NumberInput
                        value={s.quantity}
                        onChange={(val) =>
                          setServices((prev) =>
                            prev.map((item, i) =>
                              i === idx
                                ? { ...item, quantity: val as number }
                                : item
                            )
                          )
                        }
                        min={1}
                        size="xs"
                        hideControls
                      />
                    </div>
                  </td>
                  <td className="p-2 text-right">{price.toLocaleString()}đ</td>
                  <td className="p-2 text-center">{vat}</td>
                  <td className="p-2 text-right">{total.toLocaleString()}đ</td>
                  <td className="p-2 text-center">
                    <Button
                      color="red"
                      variant="light"
                      size="xs"
                      onClick={() => handleRemoveService(idx)}
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {services.length === 0 && (
          <Text c="dimmed" mt="md" ta="center">
            Chưa có dịch vụ nào. Nhấn "Thêm dịch vụ" để bắt đầu.
          </Text>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleAddService}>
            + Thêm dịch vụ
          </Button>
          <Button onClick={handleUpdate} loading={updating} color="cyan">
            Lưu
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditInvoiceModal;
