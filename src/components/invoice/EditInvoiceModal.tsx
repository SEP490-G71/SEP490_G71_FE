// import { Modal, Button, Text } from "@mantine/core";
// import { useEffect, useState } from "react";
// import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
// import { useInvoice } from "../../hooks/invoice/useInvoice";
// import ServiceTable from "../medical-examination/MedicalServiceTable";
// import { ServiceRow } from "../../types/serviceRow";

// interface Props {
//   opened: boolean;
//   onClose: () => void;
//   invoiceId: string;
//   staffId: string;
//   availableServices: MedicalService[];
//   invoiceItems: {
//     serviceId: string;
//     quantity: number;
//   }[];
//   onSuccess?: () => void;
// }

// const EditInvoiceModal = ({
//   opened,
//   onClose,
//   invoiceId,
//   staffId,
//   availableServices,
//   invoiceItems,
//   onSuccess,
// }: Props) => {
//   const [serviceRows, setServiceRows] = useState<ServiceRow[]>([]);
//   const { updateInvoice, updating } = useInvoice();

//   useEffect(() => {
//     if (opened) {
//       const rows: ServiceRow[] = invoiceItems.map((item, idx) => {
//         const matchedService = availableServices.find(
//           (s) => s.id === item.serviceId
//         );
//         return {
//           id: idx + 1,
//           serviceId: item.serviceId,
//           serviceCode: matchedService?.serviceCode || "",
//           name: matchedService?.name || "",
//           price: matchedService?.price ?? 0,
//           discount: matchedService?.discount ?? 0,
//           vat: matchedService?.vat ?? 0,
//           quantity: item.quantity,
//           departmentName: matchedService?.department?.name || "",
//           total:
//             (matchedService?.price ?? 0) *
//             (1 + (matchedService?.vat ?? 0) / 100) *
//             item.quantity,
//         };
//       });

//       setServiceRows([
//         ...rows,
//         {
//           id: rows.length + 1,
//           serviceId: null,
//           serviceCode: "",
//           name: "",
//           price: 0,
//           discount: 0,
//           vat: 0,
//           quantity: 1,
//           total: 0,
//           departmentName: "",
//         },
//       ]);
//     }
//   }, [opened, invoiceItems, availableServices]);

//   const handleUpdate = async () => {
//     const validRows = serviceRows.filter(
//       (s) => s.serviceId !== null && s.serviceId.trim() !== ""
//     );
//     const isValid = validRows.every((s) => s.quantity > 0);

//     if (!isValid || validRows.length === 0) {
//       alert("Vui lòng chọn đầy đủ dịch vụ và số lượng!");
//       return;
//     }

//     try {
//       const formatted = validRows.map(({ serviceId, quantity }) => ({
//         serviceId: serviceId as string,
//         quantity,
//       }));

//       await updateInvoice({ invoiceId, staffId, services: formatted });
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       alert("Có lỗi xảy ra khi cập nhật hóa đơn.");
//     }
//   };

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       size="xl"
//       title={
//         <div>
//           <h2 className="text-xl font-bold">Cập nhật dịch vụ</h2>
//           <div className="mt-2 border-b border-gray-300" />
//         </div>
//       }
//     >
//       <div className="overflow-x-auto mt-4">
//         <ServiceTable
//           serviceRows={serviceRows}
//           setServiceRows={setServiceRows}
//           medicalServices={availableServices}
//           serviceOptions={availableServices.map((s) => ({
//             value: s.id,
//             label: `${s.name} (${s.serviceCode})`,
//           }))}
//           editable={true}
//           showDepartment={false}
//         />

//         {serviceRows.length === 0 && (
//           <Text c="dimmed" mt="md" ta="center">
//             Chưa có dịch vụ nào. Nhấn "Thêm dịch vụ" để bắt đầu.
//           </Text>
//         )}

//         <div className="flex justify-end gap-2 mt-4">
//           <Button
//             variant="outline"
//             onClick={() =>
//               setServiceRows((prev) => [
//                 ...prev,
//                 {
//                   id:
//                     prev.length > 0
//                       ? Math.max(...prev.map((r) => r.id)) + 1
//                       : 1,
//                   serviceId: null,
//                   serviceCode: "",
//                   name: "",
//                   price: 0,
//                   discount: 0,
//                   vat: 0,
//                   quantity: 1,
//                   total: 0,
//                   departmentName: "",
//                 },
//               ])
//             }
//           >
//             + Thêm dịch vụ
//           </Button>
//           <Button onClick={handleUpdate} loading={updating} color="cyan">
//             Lưu
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditInvoiceModal;

// import { Modal, Text, Title, ScrollArea, Button, Divider } from "@mantine/core";
// import { useEffect, useState } from "react";
// import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
// import { ServiceRow } from "../../types/serviceRow";
// import ServiceTable from "../medical-examination/MedicalServiceTable";

// interface Props {
//   opened: boolean;
//   onClose: () => void;
//   invoiceItems: {
//     serviceCode: string;
//     name: string;
//     quantity: number;
//     price: number;
//     discount: number;
//     vat: number;
//     total: number;
//   }[];
//   availableServices: MedicalService[];
// }

// const ViewInvoiceServicesModal = ({
//   opened,
//   onClose,
//   invoiceItems,
//   availableServices,
// }: Props) => {
//   const [serviceRows, setServiceRows] = useState<ServiceRow[]>([]);

//   // Tạo serviceOptions từ danh sách dịch vụ
//   const serviceOptions = availableServices.map((s) => ({
//     value: s.id,
//     label: s.name,
//   }));

//   // Load các dịch vụ từ invoice khi mở modal
//   useEffect(() => {
//     if (!opened) return;

//     const rows: ServiceRow[] = invoiceItems.map((item, index) => {
//       const matched = availableServices.find(
//         (s) =>
//           s.serviceCode === item.serviceCode ||
//           s.name.toLowerCase() === item.name.toLowerCase()
//       );

//       return {
//         id: index + 1,
//         serviceId: matched?.id ?? null,
//         serviceCode: item.serviceCode,
//         name: item.name,
//         price: item.price,
//         discount: item.discount,
//         vat: item.vat,
//         quantity: item.quantity,
//         departmentName: matched?.department?.name ?? "",
//         total: item.total,
//       };
//     });

//     setServiceRows(rows);
//   }, [opened, invoiceItems, availableServices]);

//   // Thêm dòng trống mới
//   const handleAddEmptyRow = () => {
//     const newRow: ServiceRow = {
//       id: serviceRows.length + 1,
//       serviceId: null,
//       serviceCode: "",
//       name: "",
//       price: 0,
//       discount: 0,
//       vat: 0,
//       quantity: 1,
//       departmentName: "",
//       total: 0,
//     };
//     setServiceRows([...serviceRows, newRow]);
//   };

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       size="80vw"
//       fullScreen={false}
//       centered
//       withCloseButton
//       title={
//         <div>
//           <Title order={4} c="blue.7">
//             Chi tiết dịch vụ trong hóa đơn
//           </Title>
//           <Divider mt="xs" />
//         </div>
//       }
//     >
//       <div className="flex justify-between items-center mb-2 mt-1">
//         <Button
//           size="xs"
//           onClick={handleAddEmptyRow}
//           variant="outline"
//           color="blue"
//         >
//           + Thêm dịch vụ
//         </Button>
//       </div>

//       <ScrollArea type="auto" offsetScrollbars scrollbarSize={8} h={400}>
//         <div style={{ width: "100%", overflowX: "auto" }}>
//           <div style={{ minWidth: 700, maxWidth: "100%" }}>
//             {serviceRows.length > 0 ? (
//               <ServiceTable
//                 serviceRows={serviceRows}
//                 setServiceRows={setServiceRows}
//                 medicalServices={availableServices}
//                 serviceOptions={serviceOptions}
//                 editable={true}
//                 showDepartment={true}
//               />
//             ) : (
//               <Text ta="center" c="dimmed" mt="md">
//                 Không có dịch vụ nào được ghi nhận trong hóa đơn này.
//               </Text>
//             )}
//           </div>
//         </div>
//       </ScrollArea>

//       <div className="flex justify-end gap-2 mt-4">
//         <Button onClick={onClose}>Đóng</Button>
//       </div>
//     </Modal>
//   );
// };

// export default ViewInvoiceServicesModal;

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
  onChange: (rows: ServiceRow[]) => void;
}

const EditInvoiceServicesModal = ({
  opened,
  onClose,
  invoiceItems,
  availableServices,
  onChange,
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

    // ✅ Thêm 1 dòng trống để người dùng có thể thêm mới
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

    setServiceRows(rows);
  }, [opened, invoiceItems, availableServices]);

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
            Chỉnh sửa dịch vụ trong hóa đơn
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
          Hủy
        </Button>
        <Button
          onClick={() => {
            const cleanedRows = serviceRows.filter((r) => r.serviceId);
            onChange(cleanedRows);
            onClose();
          }}
        >
          Lưu dịch vụ
        </Button>
      </div>
    </Modal>
  );
};

export default EditInvoiceServicesModal;
