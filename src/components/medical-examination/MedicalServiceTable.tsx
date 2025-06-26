import { Button, Select, Table, NumberInput } from "@mantine/core";
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
            serviceId,
            serviceCode: selectedService.serviceCode,
            name: selectedService.name,
            price: selectedService.price,
            discount: selectedService.discount,
            vat: selectedService.vat,
            departmentName: selectedService.department?.name || "",
            total:
              selectedService.price *
              (1 + (selectedService.vat || 0) / 100) *
              (r.quantity || 1),
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
        ? {
            ...r,
            quantity,
            total: (r.price ?? 0) * (1 + (r.vat ?? 0) / 100) * quantity,
          }
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

  const totalCost = serviceRows.reduce((sum, row) => {
    const vat = row.vat || 0;
    const price = row.price || 0;
    return sum + price * (1 + vat / 100) * row.quantity;
  }, 0);

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: "800px" }}>
        <Table>
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th style={{ border: "1px solid #ccc", textAlign: "center" }}>
                STT
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  textAlign: "center",
                }}
              >
                Mã DV
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  textAlign: "left",
                  paddingLeft: "20px",
                }}
              >
                Tên DV
              </th>
              <th style={{ border: "1px solid #ccc", textAlign: "center" }}>
                ĐVT
              </th>
              <th style={{ border: "1px solid #ccc", textAlign: "center" }}>
                SL
              </th>
              {showDepartment && (
                <th
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}
                >
                  Phòng khám
                </th>
              )}
              <th
                style={{
                  border: "1px solid #ccc",
                  textAlign: "right",
                  paddingRight: "20px",
                }}
              >
                Đơn giá
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                Giảm giá
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  textAlign: "center",
                }}
              >
                VAT
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                Thành tiền
              </th>
              {editable && (
                <th style={{ border: "1px solid #ccc", textAlign: "center" }}>
                  Tác vụ
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {serviceRows.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                }}
              >
                <td style={{ border: "1px solid #ccc", textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={{ border: "1px solid #ccc", textAlign: "center" }}>
                  {row.serviceCode || "---"}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}
                >
                  {editable ? (
                    <Select
                      data={serviceOptions}
                      searchable
                      value={row.serviceId}
                      onChange={(value) =>
                        handleSelectService(index, value ?? null)
                      }
                      placeholder="Chọn dịch vụ"
                      size="xs"
                      variant="unstyled"
                      styles={{
                        input: {
                          paddingLeft: 0,
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#000",
                        },
                      }}
                    />
                  ) : (
                    row.name || "---"
                  )}
                </td>
                <td style={{ border: "1px solid #ccc", textAlign: "center" }}>
                  Lần
                </td>
                <td style={{ border: "1px solid #ccc", textAlign: "center" }}>
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
                  <td
                    style={{
                      border: "1px solid #ccc",
                      textAlign: "left",
                      paddingLeft: "20px",
                    }}
                  >
                    {row.departmentName || "---"}
                  </td>
                )}
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "right",
                    paddingRight: "10px",
                  }}
                >
                  {row.price?.toLocaleString("vi-VN") || 0}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  {row.discount ?? 0}%
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  {row.vat ?? 0}%
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "right",
                    paddingRight: "10px",
                  }}
                >
                  {row.total?.toLocaleString("vi-VN") || 0}
                </td>
                {editable && (
                  <td style={{ border: "1px solid #ccc", textAlign: "center" }}>
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
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td
                colSpan={showDepartment ? 9 : 8}
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "16px", // Chữ to hơn
                  paddingTop: "12px",
                  paddingBottom: "12px", // Tạo khoảng cách trên dưới
                  paddingRight: "16px", // Khoảng cách phải
                  border: "1px solid #dee2e6",
                  backgroundColor: "#f1f1f1",
                }}
              >
                Tổng cộng:
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "red",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingRight: "10px",
                  textAlign: "right",
                  border: "1px solid #dee2e6",
                  backgroundColor: "#f1f1f1",
                }}
              >
                {totalCost.toLocaleString("vi-VN")}
              </td>
              {editable && <td style={{ border: "1px solid #dee2e6" }} />}
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  );
};

export default ServiceTable;
