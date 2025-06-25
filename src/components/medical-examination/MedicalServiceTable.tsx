import { Button, Select, Table } from "@mantine/core";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { FaTrash } from "react-icons/fa6";

interface ServiceRow {
  id: number;
  serviceId: string | null;
  quantity: number;
}

interface Props {
  serviceRows: ServiceRow[];
  setServiceRows: (rows: ServiceRow[]) => void;
  medicalServices: MedicalService[];
  serviceOptions: { value: string; label: string }[];
}

const ServiceTable = ({
  serviceRows,
  setServiceRows,
  medicalServices,
  serviceOptions,
}: Props) => {
  const getServiceDetail = (id: string | null) =>
    medicalServices.find((s) => s.id === id);

  const getNextId = (): number =>
    serviceRows.length > 0 ? Math.max(...serviceRows.map((r) => r.id)) + 1 : 1;

  const handleSelectService = (index: number, serviceId: string | null) => {
    const updated = serviceRows.map((r, i) =>
      i === index ? { ...r, serviceId } : r
    );

    const isLastRow = index === serviceRows.length - 1;
    const shouldAddNew = isLastRow && serviceId;

    setServiceRows(
      shouldAddNew
        ? [...updated, { id: getNextId(), serviceId: null, quantity: 1 }]
        : updated
    );
  };

  const handleRemoveRow = (index: number) => {
    const updated = serviceRows.filter((_, i) => i !== index);
    setServiceRows(
      updated.length === 0
        ? [{ id: getNextId(), serviceId: null, quantity: 1 }]
        : updated
    );
  };

  const totalCost = serviceRows.reduce((sum, row) => {
    const service = getServiceDetail(row.serviceId);
    if (!service) return sum;
    const vat = service.vat || 0;
    return sum + service.price * (1 + vat / 100) * row.quantity;
  }, 0);

  return (
    <Table
      verticalSpacing="xs"
      style={{ minWidth: 800, borderCollapse: "collapse" }}
    >
      <thead style={{ backgroundColor: "#f1f1f1" }}>
        <tr>
          {[
            "STT",
            "Mã DV",
            "Tên DV",
            "ĐVT",
            "SL",
            "Phòng khám",
            "Đơn giá",
            "VAT",
            "Thành tiền",
            "Ttác",
          ].map((col, idx) => (
            <th
              key={idx}
              style={{
                textAlign: "center",
                padding: "6px 8px",
                fontWeight: 500,
                border: "1px solid #dee2e6",
                backgroundColor: col === "Ttác" ? "#f1f1f1" : undefined,
                position: col === "Ttác" ? "sticky" : undefined,
                right: col === "Ttác" ? 0 : undefined,
                zIndex: col === "Ttác" ? 2 : undefined,
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody style={{ textAlign: "center" }}>
        {serviceRows.map((row, index) => {
          const service = getServiceDetail(row.serviceId);
          return (
            <tr key={row.id}>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {index + 1}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {service?.serviceCode || ""}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                <Select
                  placeholder="Chọn dịch vụ"
                  searchable
                  size="xs"
                  data={serviceOptions}
                  value={row.serviceId}
                  onChange={(value) => handleSelectService(index, value)}
                  styles={{
                    input: {
                      border: "none",
                      borderRadius: 0,
                      textAlign: "center",
                      minHeight: "28px",
                      padding: "0 4px",
                      lineHeight: "1.2",
                    },
                  }}
                />
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {service ? "Lần" : ""}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {service ? row.quantity : ""}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {service?.department?.name || ""}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {service ? service.price.toLocaleString("vi-VN") : ""}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {service?.vat ? `${service.vat}%` : ""}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                {service
                  ? (
                      service.price *
                      (1 + (service.vat || 0) / 100) *
                      row.quantity
                    ).toLocaleString("vi-VN")
                  : ""}
              </td>
              <td
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #dee2e6",
                  position: "sticky",
                  right: 0,
                  zIndex: 1,
                  padding: "2px 4px",
                }}
              >
                {service && (
                  <Button
                    variant="subtle"
                    size="sm"
                    color="red"
                    style={{ marginTop: "2px", marginLeft: "4px" }}
                    onClick={() => handleRemoveRow(index)}
                  >
                    <FaTrash size="16" />
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td
            colSpan={9}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              padding: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            Tổng chi
          </td>
          <td
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "red",
              backgroundColor: "#f9f9f9",
              position: "sticky",
              right: 0,
              zIndex: 1,
              border: "1px solid #dee2e6",
            }}
          >
            {totalCost.toLocaleString("vi-VN")}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default ServiceTable;
