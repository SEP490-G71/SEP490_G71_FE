import {
  Flex,
  Grid,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  Table,
  TextInput,
  Title,
  Text,
} from "@mantine/core";

import { Patient } from "../../types/Patient/Patient";
import StatusCell from "./StatusCell";
import { Group } from "@mantine/core";

type Props = {
  selectedPatient: Patient | null;
  onSelectPatient: (p: Patient) => void;
  patientList: Patient[];
  setPatientList: (list: Patient[]) => void;
};

const PatientPanel = ({
  selectedPatient,
  onSelectPatient,
  patientList,
}: Props) => {
  // Nếu chưa có API thì sau này có thể fetch ở đây, tạm thời không cần useEffect
  return (
    <Grid.Col span={{ base: 12, md: 4 }}>
      <Flex direction="column">
        {/* Tìm kiếm */}
        <Paper shadow="xs" p="md" radius="md" mb="md" withBorder>
          <Grid gutter="xs">
            <Grid.Col span={6}>
              <Select
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                data={[]}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Mã KCB" placeholder="Nhập mã KCB" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Từ ngày" placeholder="dd/mm/yyyy" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Đến ngày" placeholder="dd/mm/yyyy" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Họ tên" placeholder="Nhập họ tên" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Mã BN" placeholder="Nhập mã BN" />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Phòng đăng ký"
                placeholder="Chọn phòng"
                data={["Phòng nội tổng quát", "Phòng tim mạch"]}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Ưu tiên"
                placeholder="Chọn mức ưu tiên"
                data={["Cao", "Trung bình", "Thấp"]}
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Danh sách đăng ký */}
        <Paper shadow="lg" p="md" radius="md" withBorder>
          <Title order={5} mb="md">
            Danh sách đăng ký
          </Title>
          {/* <ScrollArea offsetScrollbars scrollbarSize={8} h="auto">
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              style={{
                minWidth: "700px",
                borderCollapse: "separate",
                borderSpacing: "2px",
              }}
            >
              <thead style={{ backgroundColor: "#f0f0f0" }}>
                <tr>
                  <th style={{ textAlign: "center" }}>TT</th>
                  <th style={{ textAlign: "center" }}>STT</th>
                  <th style={{ textAlign: "center" }}>Mã KCB</th>
                  <th style={{ textAlign: "center" }}>Mã BN</th>
                  <th style={{ textAlign: "center" }}>Tên BN</th>
                </tr>
              </thead>
              <tbody style={{ lineHeight: "1.4rem" }}>
                {patientList.map((p, index) => (
                  <tr
                    key={index}
                    onClick={() => onSelectPatient(p)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedPatient?.maBn === p.maBn
                          ? "#e0f7ff"
                          : index % 2 === 0
                          ? "#ffffff"
                          : "#eeeeee",
                    }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <StatusCell status={p.trangThai} />
                    </td>
                    <td style={{ textAlign: "center" }}>{p.stt}</td>
                    <td style={{ textAlign: "center" }}>{p.maKcb}</td>
                    <td style={{ textAlign: "center" }}>{p.maBn}</td>
                    <td style={{ textAlign: "center" }}>{p.ten}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea> */}
          <ScrollArea offsetScrollbars scrollbarSize={8} h="auto">
            <Table
              withColumnBorders
              highlightOnHover
              style={{
                minWidth: 700,
                borderCollapse: "separate",
                borderSpacing: "2px",
              }}
            >
              <thead style={{ backgroundColor: "#dee2e6" }}>
                <tr>
                  <th style={{ textAlign: "center" }}>TT</th>
                  <th style={{ textAlign: "center" }}>STT</th>
                  <th style={{ textAlign: "center" }}>Mã KCB</th>
                  <th style={{ textAlign: "center" }}>Mã BN</th>
                  <th style={{ textAlign: "center" }}>Tên BN</th>
                  <th style={{ textAlign: "center" }}>Điện thoại</th>
                </tr>
              </thead>

              <tbody>
                {patientList.map((p, index) => {
                  const isSelected = selectedPatient?.maBn === p.maBn;

                  return (
                    <tr
                      key={index}
                      onClick={() => onSelectPatient(p)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? "#cce5ff" // chọn dòng
                          : index % 2 === 0
                          ? "#f8f9fa" // hàng chẵn
                          : "#e9ecef", // hàng lẻ xám hơn
                        borderBottom: "1px solid #adb5bd", // phân cách hàng
                      }}
                    >
                      <td style={{ textAlign: "center" }}>
                        <StatusCell status={p.trangThai} />
                      </td>
                      <td style={{ textAlign: "center" }}>{p.stt}</td>
                      <td style={{ textAlign: "center" }}>{p.maKcb}</td>
                      <td style={{ textAlign: "center" }}>{p.maBn}</td>
                      <td style={{ textAlign: "center" }}>{p.ten}</td>
                      <td style={{ textAlign: "center" }}>{p.sdt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ScrollArea>

          {/* Pagination & controls */}
          <Group justify="space-between" mt="sm">
            <Text size="sm">
              1–{patientList.length} của {patientList.length}
            </Text>

            <Group>
              <Select
                data={["10", "20", "50"]}
                defaultValue="10"
                w={100}
                variant="filled"
                size="xs"
              />
              <Pagination total={1} value={1} size="sm" />
            </Group>
          </Group>
        </Paper>
      </Flex>
    </Grid.Col>
  );
};

export default PatientPanel;
