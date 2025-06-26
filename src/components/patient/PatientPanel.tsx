import {
  Flex,
  Grid,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  Table,
  Title,
  Text,
} from "@mantine/core";

import { Patient } from "../../types/Patient/Patient";
import StatusCell from "./StatusCell";
import { Group } from "@mantine/core";
import React from "react";
import FilterPanel from "../common/FilterSection";

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
            <FilterPanel />
          </Grid>

          <Title order={5} mb="md">
            Danh sách đăng ký
          </Title>

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
                  <th style={{ textAlign: "center" }}>Mã BN</th>
                  <th style={{ textAlign: "left", paddingLeft: "20px" }}>
                    Tên BN
                  </th>
                  <th style={{ textAlign: "center" }}>Điện thoại</th>
                </tr>
              </thead>

              <tbody>
                {patientList.map((p, index) => {
                  const isSelected =
                    selectedPatient?.patientCode === p.patientCode;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectPatient(p)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? "#cce5ff"
                          : index % 2 === 0
                          ? "#f8f9fa"
                          : "#e9ecef",
                        borderBottom: "1px solid #adb5bd",
                      }}
                    >
                      <td style={{ textAlign: "center" }}>
                        <StatusCell status={"Đang khám"} />{" "}
                        {/* mock nếu chưa có p.trangThai */}
                      </td>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td style={{ textAlign: "center" }}>{p.patientCode}</td>
                      <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                        {p.fullName}
                      </td>
                      <td style={{ textAlign: "center" }}>{p.phone}</td>
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
export default React.memo(PatientPanel);
