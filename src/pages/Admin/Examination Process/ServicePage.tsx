import {
  Button,
  Flex,
  Grid,
  Paper,
  ScrollArea,
  Select,
  Table,
  Divider,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import { MedicalService } from "../../../types/Admin/MedicalService/MedicalService";
import PatientPanel from "../../../components/patient/PatientPanel";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import { usePatientStore } from "../../../components/stores/patientStore";

const ServicePage = () => {
  const { medicalServices, fetchAllMedicalServices, loading } =
    useMedicalService();

  useEffect(() => {
    fetchAllMedicalServices(0, 100);
  }, []);

  const [selectedServices, setSelectedServices] = useState<
    {
      id: string;
      service: MedicalService | null;
    }[]
  >([{ id: crypto.randomUUID(), service: null }]);

  const handleSelectService = (index: number, serviceId: string | null) => {
    if (!serviceId) return;
    const selected = medicalServices.find((s) => s.id === serviceId);
    if (!selected) return;

    const newList = [...selectedServices];
    newList[index].service = selected;

    // Nếu đang chọn dòng cuối cùng → auto thêm dòng mới
    if (index === selectedServices.length - 1) {
      newList.push({ id: crypto.randomUUID(), service: null });
    }

    setSelectedServices(newList);
  };

  const serviceOptions = medicalServices.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const { selectedPatient, setSelectedPatient, patientList, setPatientList } =
    usePatientStore();
  const isEditable = selectedPatient?.trangThai?.toLowerCase() === "đang khám";
  const totalCost = selectedServices.reduce((sum, row) => {
    if (!row.service) return sum;
    const vat = row.service.vat || 0;
    return sum + row.service.price * (1 + vat / 100);
  }, 0);

  const handleSave = () => {
    if (!selectedPatient) {
      console.warn("Chưa chọn bệnh nhân");
      return;
    }

    const savedData = {
      patient: selectedPatient,
      services: selectedServices.filter((s) => s.service !== null),
      totalCost,
    };

    console.log("📦 Dữ liệu đã lưu:", savedData);
  };
  return (
    <Grid p="md" gutter="md" align="start">
      {/* Left Column: Search + Table */}
      <PatientPanel
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        patientList={patientList}
        setPatientList={setPatientList}
      />

      {/* Right Column: Detail + Form */}
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Paper>
          <PatientInfoPanel patient={selectedPatient} />
          <Divider my="sm" label="Kê dịch vụ" labelPosition="left" />
          {/* Thanh công cụ */}
          <Flex justify="space-between" align="center" mt="sm" mb="sm">
            <Text fw={600}>Danh sách dịch vụ</Text>

            <Flex gap="xs">
              <Button variant="outline" color="blue" size="xs" leftSection="🧾">
                Kết quả
              </Button>
              <Button
                color="blue"
                size="xs"
                leftSection="💾"
                onClick={handleSave}
              >
                Lưu
              </Button>
            </Flex>
          </Flex>

          {/* Bảng dịch vụ */}
          <ScrollArea offsetScrollbars scrollbarSize={8}>
            <Table
              verticalSpacing="xs"
              style={{
                minWidth: 800,
                borderCollapse: "collapse",
              }}
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
                    "Ttác",
                  ].map((col, idx) => (
                    <th
                      key={idx}
                      style={{
                        textAlign: "center",
                        padding: "6px 8px",
                        backgroundColor: "#f1f1f1",
                        fontWeight: 500,
                        border: "1px solid #dee2e6",
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
                {selectedServices.map((row, index) => (
                  <tr key={row.id}>
                    {/* STT */}
                    <td
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {index + 1}
                    </td>

                    {/* Mã DV */}
                    <td
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {row.service?.id || ""}
                    </td>

                    {/* Tên DV (Select) */}
                    <td
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {!row.service ? (
                        <Select
                          placeholder={loading ? "Đang tải..." : "Chọn dịch vụ"}
                          data={serviceOptions}
                          searchable
                          size="xs"
                          disabled={loading || !isEditable}
                          value={null}
                          onChange={(value) =>
                            handleSelectService(index, value)
                          }
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
                      ) : (
                        row.service?.name
                      )}
                    </td>

                    {/* ĐVT */}
                    <td
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {row.service ? "Lần" : ""}
                    </td>

                    {/* SL */}
                    <td
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {row.service ? "1" : ""}
                    </td>

                    {/* Phòng khám */}
                    <td
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {row.service?.department?.name || ""}
                    </td>

                    {/* Đơn giá */}
                    <td
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {row.service
                        ? (
                            row.service.price *
                            (1 + (row.service.vat || 0) / 100)
                          ).toLocaleString("vi-VN")
                        : ""}
                    </td>

                    {/* Nút xoá */}
                    <td
                      style={{
                        backgroundColor: "#fff",
                        position: "sticky",
                        right: 0,
                        zIndex: 1,
                        border: "1px solid #dee2e6",
                        padding: "2px 4px",
                      }}
                    >
                      {row.service && (
                        <Button
                          variant="subtle"
                          size="sm"
                          color="red"
                          style={{ marginTop: "2px", marginLeft: "4px" }}
                          onClick={() => {
                            const newList = selectedServices.filter(
                              (_, i) => i !== index
                            );
                            setSelectedServices(
                              newList.length === 0
                                ? [{ id: crypto.randomUUID(), service: null }]
                                : newList
                            );
                          }}
                        >
                          🗑
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan={7}
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
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default ServicePage;
