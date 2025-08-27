import { Button, NumberInput, Table, ScrollArea } from "@mantine/core";
import { FaTrash } from "react-icons/fa6";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { ServiceRow } from "../../types/serviceRow";
import { InvoiceDetail } from "../../types/Invoice/invoice";
import ServiceSelectTable from "./ServiceSelectTable";

interface Props {
  serviceRows: ServiceRow[];
  setServiceRows: (rows: ServiceRow[]) => void;
  medicalServices: MedicalService[];
  nonDefaultServiceOptions?: {
    group: string;
    items: { value: string; label: string }[];
  }[];
  serviceOptions?: {
    group: string;
    items: { value: string; label: string }[];
  }[];
  defaultServiceIds?: string[];
  editable?: boolean;
  showDepartment?: boolean;
  invoiceDetail?: InvoiceDetail;
  allowSelectDefaultServices?: boolean;
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: "6px",
  whiteSpace: "nowrap" as const,
  verticalAlign: "middle",
};

const align = {
  center: { textAlign: "center" as const },
  left: { textAlign: "left" as const, paddingLeft: "10px" },
  right: { textAlign: "right" as const, paddingRight: "10px" },
};

const calculateTotal = (row: ServiceRow) => {
  const base = row.price ?? 0;
  const quantity = row.quantity ?? 1;
  const discount = row.discount ?? 0;
  const vat = row.vat ?? 0;
  const discounted = base * quantity * ((100 - discount) / 100);
  const taxed = discounted * ((100 + vat) / 100);
  return Math.round(taxed);
};
const ServiceTable = ({
  serviceRows,
  setServiceRows,
  medicalServices,
  // serviceOptions,
  editable = true,
  showDepartment = false,
  // nonDefaultServiceOptions,
  invoiceDetail,
  allowSelectDefaultServices,
}: Props) => {
  const getServiceDetail = (id: string | null) =>
    medicalServices.find((s) => s.id === id);

  const buildLabel = (s: MedicalService) => {
    const room = s.department?.roomNumber
      ? ` - ${s.department.roomNumber}`
      : "";
    return `${s.serviceCode} - ${s.name}${room}`;
  };

  // const allServiceRows = medicalServices.map((s) => ({
  //   value: s.id,
  //   label: buildLabel(s), // ✅ QUAN TRỌNG
  //   serviceCode: s.serviceCode,
  //   name: s.name,
  //   roomNumber: s.department?.roomNumber || "",
  //   departmentName: s.department?.name || "",
  //   specializationName: s.department?.specialization?.name || "",
  // }));

  // const nonDefaultServiceRows = medicalServices
  //   .filter((s) => !s.defaultService)
  //   .map((s) => ({
  //     value: s.id,
  //     serviceCode: s.serviceCode,
  //     name: s.name,
  //     roomNumber: s.department?.roomNumber || "",
  //     departmentName: s.department?.name || "",
  //     specializationName: s.department?.specialization?.name || "",
  //   }));

  const nonDefaultServiceRows = medicalServices
    .filter((s) => !s.defaultService)
    .map((s) => ({
      value: s.id,
      label: buildLabel(s),
      serviceCode: s.serviceCode,
      name: s.name,
      roomNumber: s.department?.roomNumber || "",
      departmentName: s.department?.name || "",
      specializationName: s.department?.specialization?.name || "",
    }));

  const getNextId = (): number =>
    serviceRows.length > 0 ? Math.max(...serviceRows.map((r) => r.id)) + 1 : 1;

  // const handleSelectService = (index: number, serviceId: string | null) => {
  //   const selectedService = getServiceDetail(serviceId);
  //   const updated = serviceRows.map((r, i) => {
  //     if (i !== index || !selectedService) return r;

  //     return {
  //       id: typeof r.id === "string" ? getNextId() : r.id,
  //       serviceId,
  //       serviceCode: selectedService.serviceCode,
  //       name: selectedService.name,
  //       price: selectedService.price,
  //       discount: selectedService.discount,
  //       vat: selectedService.vat,
  //       departmentName: selectedService.department?.name || "",
  //       quantity: r.quantity ?? 1,
  //       total: calculateTotal({
  //         ...r,
  //         price: selectedService.price,
  //         discount: selectedService.discount,
  //         vat: selectedService.vat,
  //         quantity: r.quantity ?? 1,
  //       }),
  //     };
  //   });

  const handleSelectService = (index: number, serviceId: string | null) => {
    const selectedService = getServiceDetail(serviceId);

    // ✅ Chặn chọn dịch vụ default nếu không được phép
    if (!allowSelectDefaultServices && selectedService?.defaultService) {
      return; // bỏ qua thay đổi
    }

    const updated = serviceRows.map((r, i) => {
      if (i !== index || !selectedService) return r;

      return {
        id: typeof r.id === "string" ? getNextId() : r.id,
        serviceId,
        serviceCode: selectedService.serviceCode,
        name: selectedService.name,
        price: selectedService.price,
        discount: selectedService.discount,
        vat: selectedService.vat,
        departmentName: selectedService.department?.name || "",
        quantity: r.quantity ?? 1,
        total: calculateTotal({
          ...r,
          price: selectedService.price,
          discount: selectedService.discount,
          vat: selectedService.vat,
          quantity: r.quantity ?? 1,
        }),
      };
    });

    const isLastRow = index === serviceRows.length - 1;
    const shouldAddNew = isLastRow && serviceId;

    setServiceRows(
      shouldAddNew
        ? [...updated, { id: getNextId(), serviceId: null, quantity: 1 }]
        : updated
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updated = serviceRows.map((r, i) =>
      i === index
        ? { ...r, quantity, total: calculateTotal({ ...r, quantity }) }
        : r
    );
    setServiceRows(updated);
  };

  const handleRemoveRow = (index: number) => {
    const updated = serviceRows.filter((_, i) => i !== index);
    setServiceRows(
      updated.length === 0
        ? [{ id: getNextId(), serviceId: null, quantity: 1 }]
        : updated
    );
  };

  const renderRow = (row: ServiceRow, index: number) => {
    // const optionsToUse =
    //   allowSelectDefaultServices || index === 0
    //     ? serviceOptions
    //     : nonDefaultServiceOptions;
    // const optionsToUse = allowSelectDefaultServices
    //   ? allServiceRows
    //   : nonDefaultServiceRows;
    const isDefaultRow = !!row.isDefault;
    return (
      <tr
        key={row.id}
        style={{
          backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
          position: "relative",
        }}
      >
        <td style={{ ...cellStyle, ...align.center, width: 60 }}>
          {index + 1}
        </td>
        <td style={{ ...cellStyle, ...align.center, width: 120 }}>
          {row.serviceCode || "---"}
        </td>
        {/* <td style={{ ...cellStyle, ...align.left, minWidth: 320 }}>
          {editable ? (
            <ServiceSelectTable
              value={row.serviceId}
              onChange={(v) => handleSelectService(index, v)}
              // options={
              //   allowSelectDefaultServices || index === 0
              //     ? allServiceRows
              //     : nonDefaultServiceRows
              // }
              options={optionsToUse}
              size="xs"
            />
          ) : (
            row.name || "---"
          )}
        </td> */}

        {/* Tên DV */}
        <td style={{ ...cellStyle, ...align.left, minWidth: 320 }}>
          {editable && !isDefaultRow ? (
            <ServiceSelectTable
              value={row.serviceId}
              onChange={(v) => handleSelectService(index, v)}
              // ✅ chỉ cho chọn dịch vụ không-default
              options={nonDefaultServiceRows}
              size="xs"
            />
          ) : (
            // ✅ Dòng default hiển thị text khóa (hoặc khi không editable)
            row.name || "---"
          )}
        </td>

        <td style={{ ...cellStyle, ...align.center, width: 80 }}>
          {editable ? (
            <NumberInput
              value={row.quantity}
              min={1}
              size="xs"
              w={60}
              variant="unstyled"
              styles={{ input: { textAlign: "center" } }}
              onChange={(value) =>
                handleQuantityChange(index, Number(value) || 1)
              }
            />
          ) : (
            row.quantity
          )}
        </td>
        {showDepartment && (
          <td style={{ ...cellStyle, ...align.left, minWidth: 200 }}>
            {row.departmentName || "---"}
          </td>
        )}
        <td style={{ ...cellStyle, ...align.right, width: 100 }}>
          {row.price?.toLocaleString("vi-VN") || 0}
        </td>
        <td style={{ ...cellStyle, ...align.center, width: 80 }}>
          {row.discount ?? 0}%
        </td>
        <td style={{ ...cellStyle, ...align.center, width: 80 }}>
          {row.vat ?? 0}%
        </td>
        <td style={{ ...cellStyle, ...align.right, width: 120 }}>
          {row.total?.toLocaleString("vi-VN") || 0}
        </td>
        {editable && (
          <td
            style={{
              position: "sticky",
              right: 0,
              backgroundColor: "#fff",
              zIndex: 15,
              boxShadow: "0 0 0 1px #ccc",
              ...cellStyle,
              ...align.center,
              width: 60,
              paddingRight: 0,
              paddingLeft: 0,
            }}
          >
            {!(index === serviceRows.length - 1 && !row.serviceId) &&
              !row.isDefault && (
                <Button
                  variant="subtle"
                  size="xs"
                  color="red"
                  onClick={() => handleRemoveRow(index)}
                >
                  <FaTrash />
                </Button>
              )}
          </td>
        )}
      </tr>
    );
  };

  return (
    <ScrollArea offsetScrollbars scrollbarSize={8}>
      <div className="min-w-[800px]">
        <Table>
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th style={{ ...cellStyle, ...align.center, width: 60 }}>STT</th>
              <th style={{ ...cellStyle, ...align.center, width: 120 }}>
                Mã DV
              </th>
              <th style={{ ...cellStyle, ...align.left, minWidth: 220 }}>
                Tên DV
              </th>
              <th style={{ ...cellStyle, ...align.center, width: 80 }}>SL</th>
              {showDepartment && (
                <th style={{ ...cellStyle, ...align.left, minWidth: 200 }}>
                  Phòng khám
                </th>
              )}
              <th style={{ ...cellStyle, ...align.right, width: 100 }}>
                Đơn giá
              </th>
              <th style={{ ...cellStyle, ...align.center, width: 80 }}>
                Giảm giá
              </th>
              <th style={{ ...cellStyle, ...align.center, width: 80 }}>VAT</th>
              <th style={{ ...cellStyle, ...align.right, width: 120 }}>
                Thành tiền
              </th>
              {editable && (
                <th
                  style={{
                    ...cellStyle,
                    ...align.center,
                    width: 60,
                    position: "sticky",
                    right: 0,
                    background: "#f1f1f1",
                    zIndex: 20,
                    boxShadow: "0 0 0 1px #ccc",
                    paddingRight: 0,
                    paddingLeft: 0,
                  }}
                >
                  Tác vụ
                </th>
              )}
            </tr>
          </thead>
          <tbody>{serviceRows.map(renderRow)}</tbody>
          {invoiceDetail && (
            <tfoot>
              <tr>
                <td
                  colSpan={showDepartment ? 8 : 7}
                  style={{ ...cellStyle, ...align.right }}
                >
                  Tổng tiền gốc:
                </td>
                <td style={{ ...cellStyle, ...align.right }}>
                  {invoiceDetail.originalTotal.toLocaleString("vi-VN")}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={showDepartment ? 8 : 7}
                  style={{ ...cellStyle, ...align.right }}
                >
                  Giảm giá:
                </td>
                <td style={{ ...cellStyle, ...align.right, color: "orange" }}>
                  {invoiceDetail.discountTotal.toLocaleString("vi-VN")}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={showDepartment ? 8 : 7}
                  style={{ ...cellStyle, ...align.right }}
                >
                  VAT:
                </td>
                <td style={{ ...cellStyle, ...align.right }}>
                  {invoiceDetail.vatTotal.toLocaleString("vi-VN")}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={showDepartment ? 8 : 7}
                  style={{
                    ...cellStyle,
                    ...align.right,
                    fontWeight: "bold",
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>Tổng cộng:</span>
                </td>
                <td
                  style={{
                    ...cellStyle,
                    ...align.right,
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "red",
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  {invoiceDetail.total.toLocaleString("vi-VN")}
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </ScrollArea>
  );
};

export default ServiceTable;
