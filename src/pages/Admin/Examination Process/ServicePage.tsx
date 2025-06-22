import {
  Button,
  Flex,
  Grid,
  Paper,
  ScrollArea,
  Select,
  Table,
  TextInput,
  Divider,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import { MedicalService } from "../../../types/Admin/MedicalService/MedicalService";
import PatientPanel from "../../../components/patient/PatientPanel";
import { Patient } from "../../../types/Patient/Patient";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";

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

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [patientList, setPatientList] = useState<Patient[]>([
    {
      stt: 1,
      maKcb: "2506180001",
      maBn: "00000141",
      ten: "Nguyễn Văn A",
      sdt: "0967622356",
      ngaySinh: "15/08/2019",
      gioiTinh: "Nam",
      ngayDangKy: "09/08/2023",
      phong: "Phòng nội tổng quát",
      diaChi: "Thanh Hoá",
      soDangKy: 1,
      trangThai: "hoàn thành",
    },
    {
      stt: 2,
      maKcb: "2506180002",
      maBn: "00000143",
      ten: "Nguyễn Văn B",
      sdt: "0912345678",
      ngaySinh: "12/12/1990",
      gioiTinh: "Nam",
      ngayDangKy: "10/08/2023",
      phong: "Phòng tim mạch",
      diaChi: "Hà Nội",
      soDangKy: 2,
      trangThai: "tạm dừng",
    },
    {
      stt: 3,
      maKcb: "2506180003",
      maBn: "00000144",
      ten: "Trần Thị C",
      sdt: "0988888888",
      ngaySinh: "20/05/1985",
      gioiTinh: "Nữ",
      ngayDangKy: "10/08/2023",
      phong: "Phòng nội tổng quát",
      diaChi: "Nghệ An",
      soDangKy: 3,
      trangThai: "đang khám",
    },
    {
      stt: 4,
      maKcb: "2506180004",
      maBn: "00000145",
      ten: "Phạm Văn D",
      sdt: "0977777777",
      ngaySinh: "01/01/1970",
      gioiTinh: "Nam",
      ngayDangKy: "10/08/2023",
      phong: "Phòng tiêu hoá",
      diaChi: "Hải Phòng",
      soDangKy: 4,
      trangThai: "đang khám",
    },
    {
      stt: 5,
      maKcb: "2506180005",
      maBn: "00000146",
      ten: "Dương Thị E",
      sdt: "0977777777",
      ngaySinh: "01/01/1970",
      gioiTinh: "Nam",
      ngayDangKy: "10/08/2023",
      phong: "Phòng tiêu hoá",
      diaChi: "Hà Nội",
      soDangKy: 4,
      trangThai: "chờ khám",
    },
  ]);

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
              {/* <Button variant="outline" color="blue" size="xs" leftSection="🖨️">
                In
              </Button> */}
              <Button color="blue" size="xs" leftSection="💾">
                Lưu
              </Button>
            </Flex>
          </Flex>

          {/* Bảng dịch vụ */}
          <ScrollArea offsetScrollbars scrollbarSize={8}>
            <Table
              striped
              withTableBorder
              withColumnBorders
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

                    "#",
                  ].map((col, idx) => (
                    <th
                      key={idx}
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {selectedServices.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{
                      position: "relative",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {/* STT */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      {index + 1}
                    </td>

                    {/* Mã DV */}
                    <td
                      style={{
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      <TextInput
                        value={row.service?.id || ""}
                        size="xs"
                        readOnly
                      />
                    </td>

                    {/* Tên DV */}
                    <td
                      style={{
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      <Select
                        placeholder={loading ? "Đang tải..." : "Chọn dịch vụ"}
                        data={serviceOptions}
                        searchable
                        size="xs"
                        disabled={loading || !!row.service}
                        value={row.service?.id || null}
                        onChange={(value) => handleSelectService(index, value)}
                      />
                    </td>

                    {/* ĐVT */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      <TextInput
                        value={row.service ? "Lần" : ""}
                        size="xs"
                        readOnly
                      />
                    </td>

                    {/* SL */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      <TextInput
                        value={row.service ? "1" : ""}
                        size="xs"
                        readOnly
                      />
                    </td>

                    {/* Phòng khám */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      <TextInput
                        value={row.service?.department?.name || ""}
                        size="xs"
                        readOnly
                      />
                    </td>

                    {/* Đơn giá */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      <TextInput
                        value={
                          row.service
                            ? (
                                row.service.price *
                                (1 + (row.service.vat || 0) / 100)
                              ).toLocaleString("vi-VN")
                            : ""
                        }
                        size="xs"
                        readOnly
                      />
                    </td>

                    {/* 🗑 Xoá nổi đè */}
                    {row.service && (
                      <Button
                        variant="subtle"
                        size="xs"
                        color="red"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "4px",
                          transform: "translateY(-50%)",
                          zIndex: 10,
                          padding: "2px 6px",
                        }}
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default ServicePage;
