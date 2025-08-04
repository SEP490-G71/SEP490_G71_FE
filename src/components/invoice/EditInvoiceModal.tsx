import { Modal, Title, Divider, ScrollArea, Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { ServiceRow } from "../../types/serviceRow";
import ServiceTable from "../medical-examination/MedicalServiceTable";
import { useUpdateInvoiceItems } from "../../hooks/invoice/useUpdateInvoiceItems";
import { toast } from "react-toastify";

interface Props {
  opened: boolean;
  onClose: () => void;
  invoiceId: string;
  staffId: string;
  invoiceItems: {
    serviceCode: string;
    name: string;
    medicalServiceId: string | null;
    quantity: number;
    price: number;
    discount: number;
    vat: number;
    total: number;
  }[];

  availableServices: MedicalService[];
  serviceOptions: {
    group: string;
    items: { value: string; label: string }[];
  }[];

  // defaultServiceIds: string[];
  onChange?: (rows: ServiceRow[]) => void;
  editable?: boolean;
}

const ViewEditInvoiceServicesModal = ({
  opened,
  onClose,
  invoiceItems,
  availableServices,
  onChange,
  editable = true,
  invoiceId,
  staffId,
  serviceOptions,
}: // defaultServiceIds,
Props) => {
  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([]);

  useEffect(() => {
    if (!opened) return;

    const rows: ServiceRow[] = invoiceItems.map((item, index) => {
      const matched = availableServices.find(
        (s) =>
          s.serviceCode === item.serviceCode ||
          s.name.toLowerCase() === item.name.toLowerCase()
      );

      return {
        id: index + 1,
        serviceId: matched?.id ?? item.medicalServiceId ?? null,
        serviceCode: item.serviceCode,
        name: item.name,
        price: item.price,
        discount: item.discount,
        vat: item.vat,
        quantity: item.quantity,
        departmentName: matched?.department?.name ?? "",
        total: item.total,
      };
    });

    if (editable) {
      rows.push({
        id: rows.length + 1,
        serviceId: null,
        serviceCode: "",
        name: "",
        quantity: 1,
        price: 0,
        discount: 0,
        vat: 0,
        departmentName: "",
        total: 0,
      });
    }

    setServiceRows(rows);
  }, [opened, invoiceItems, availableServices, editable]);
  const { updateInvoiceItems } = useUpdateInvoiceItems();
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="70vw"
      fullScreen={false}
      centered
      title={
        <div>
          <Title order={4} c="blue.7">
            {editable
              ? "Chỉnh sửa dịch vụ trong hóa đơn"
              : "Danh sách dịch vụ đã đăng ký"}
          </Title>
          <Divider mt="xs" />
        </div>
      }
    >
      <ScrollArea type="auto" offsetScrollbars scrollbarSize={8} h={400}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: 500, maxWidth: "100%" }}>
            {serviceRows.length > 0 ? (
              <ServiceTable
                serviceRows={serviceRows}
                setServiceRows={setServiceRows}
                medicalServices={availableServices}
                serviceOptions={serviceOptions}
                // defaultServiceIds={defaultServiceIds}
                editable={editable}
                showDepartment={true}
                allowSelectDefaultServices={true}
              />
            ) : (
              <Text ta="center" c="dimmed" mt="md">
                Không có dịch vụ nào được ghi nhận trong hóa đơn này.
              </Text>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
        {editable && onChange && (
          <Button
            onClick={async () => {
              const cleanedRows = serviceRows.filter((r) => r.serviceId);

              const payload = {
                invoiceId,
                staffId,
                services: cleanedRows.map((r) => ({
                  serviceId: r.serviceId!,
                  quantity: r.quantity,
                })),
              };

              try {
                await updateInvoiceItems(payload);
                toast.success("✅ Cập nhật dịch vụ thành công");
                onChange?.(cleanedRows);
                onClose();
              } catch (err) {
                toast.error("❌ Lỗi khi cập nhật dịch vụ");
              }
            }}
          >
            Lưu dịch vụ
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ViewEditInvoiceServicesModal;
