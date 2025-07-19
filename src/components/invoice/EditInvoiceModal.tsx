import { Modal, Title, Divider, ScrollArea, Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { ServiceRow } from "../../types/serviceRow";
import ServiceTable from "../medical-examination/MedicalServiceTable";

interface Props {
  opened: boolean;
  onClose: () => void;
  invoiceItems: {
    serviceCode: string;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    vat: number;
    total: number;
  }[];
  availableServices: MedicalService[];
  onChange?: (rows: ServiceRow[]) => void; // optional
  editable?: boolean; // mặc định false
}

const ViewEditInvoiceServicesModal = ({
  opened,
  onClose,
  invoiceItems,
  availableServices,
  onChange,
  editable = false,
}: Props) => {
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
        serviceId: matched?.id ?? null,
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
  const noopSetServiceRows = () => {};
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
                serviceOptions={availableServices.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
                editable={true}
                showDepartment={true}
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
            onClick={() => {
              const cleanedRows = serviceRows.filter((r) => r.serviceId); // bỏ dòng rỗng
              onChange(cleanedRows);
              onClose();
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
