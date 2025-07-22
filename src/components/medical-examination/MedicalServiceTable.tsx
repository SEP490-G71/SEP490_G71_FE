// ✅ Refactored ServiceTable.tsx with sticky delete column and complete total row
import { Button, NumberInput, Select, Table, ScrollArea } from "@mantine/core";
import { FaTrash } from "react-icons/fa6";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { ServiceRow } from "../../types/serviceRow";

interface Props {
  serviceRows: ServiceRow[];
  setServiceRows: (rows: ServiceRow[]) => void;
  medicalServices: MedicalService[];
  serviceOptions: { value: string; label: string }[];
  editable?: boolean;
  showDepartment?: boolean;
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

const calculateTotal = ({
  price = 0,
  vat = 0,
  quantity = 1,
}: {
  price?: number;
  vat?: number;
  quantity: number;
}) => {
  return price * (1 + vat / 100) * quantity;
};
const ServiceTable = ({
  serviceRows,
  setServiceRows,
  medicalServices,
  serviceOptions,
  editable = true,
  showDepartment = false,
}: Props) => {
  const getServiceDetail = (id: string | null) =>
    medicalServices.find((s) => s.id === id);

  const getNextId = (): number =>
    serviceRows.length > 0 ? Math.max(...serviceRows.map((r) => r.id)) + 1 : 1;

  const handleSelectService = (index: number, serviceId: string | null) => {
    const selectedService = getServiceDetail(serviceId);
    const updated = serviceRows.map((r, i) =>
      i === index && selectedService
        ? {
            ...r,
            id: typeof r.id === "string" ? getNextId() : r.id,
            serviceId,
            serviceCode: selectedService.serviceCode,
            name: selectedService.name,
            price: selectedService.price,
            discount: selectedService.discount,
            vat: selectedService.vat,
            departmentName: selectedService.department?.name || "",
            total: calculateTotal({
              ...r,
              ...selectedService,
              quantity: r.quantity,
            }),
          }
        : r
    );
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

  const totalCost = serviceRows.reduce((sum, row) => sum + (row.total || 0), 0);

  const renderRow = (row: ServiceRow, index: number) => (
    <tr
      key={row.id}
      style={{
        backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
        position: "relative",
      }}
    >
      <td style={{ ...cellStyle, ...align.center, width: 60 }}>{index + 1}</td>
      <td style={{ ...cellStyle, ...align.center, width: 120 }}>
        {row.serviceCode || "---"}
      </td>
      <td
        style={{ ...cellStyle, ...align.left, minWidth: 220 }}
        title={row.name}
      >
        {editable ? (
          <Select
            data={serviceOptions}
            searchable
            value={row.serviceId}
            onChange={(value) => handleSelectService(index, value ?? null)}
            placeholder="Chọn dịch vụ"
            size="xs"
            variant="unstyled"
            styles={{
              input: { paddingLeft: 0, fontSize: "14px", fontWeight: 500 },
            }}
          />
        ) : (
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
          <Button
            variant="subtle"
            size="xs"
            color="red"
            onClick={() => handleRemoveRow(index)}
          >
            <FaTrash />
          </Button>
        </td>
      )}
    </tr>
  );

  return (
    <ScrollArea offsetScrollbars scrollbarSize={8}>
      <div className="min-w-[1200px]">
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
          <tfoot>
            <tr>
              <td
                colSpan={showDepartment ? 8 : 7}
                style={{
                  ...cellStyle,
                  ...align.right,
                  fontWeight: "bold",
                  fontSize: "16px",
                  backgroundColor: "#f1f1f1",
                }}
              >
                Tổng cộng:
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
                {totalCost.toLocaleString("vi-VN")}
              </td>
              {editable && (
                <td
                  style={{
                    ...cellStyle,
                    width: 60,
                    backgroundColor: "#f1f1f1",
                    position: "sticky",
                    right: 0,
                    zIndex: 14,
                    boxShadow: "0 0 0 1px #ccc",
                  }}
                />
              )}
            </tr>
          </tfoot>
        </Table>
      </div>
    </ScrollArea>
  );
};

export default ServiceTable;
