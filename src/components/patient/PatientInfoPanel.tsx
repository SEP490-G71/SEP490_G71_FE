import { Paper, Title, Grid, Group, Text } from "@mantine/core";
import { Patient } from "../../types/Patient/Patient";
import React from "react";
import dayjs from "dayjs";

interface Props {
  patient: Patient | null;
  onEndExamination?: () => void;
}

const PatientInfoPanel = ({ patient }: Props) => {
  return (
    <>
      <Group mb="xs" gap="xs" style={{ fontSize: "14px" }}></Group>

      <Paper mb="md">
        <Title order={4} mb="sm">
          Thông tin người đăng ký
        </Title>

        <Grid gutter="xs">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Mã BN:{" "}
              <Text span fw={700} size="md">
                {patient?.patientCode ?? "---"}
              </Text>
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Họ tên:{" "}
              <Text span fw={700} size="md">
                {patient?.fullName ?? "---"}
              </Text>
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Điện thoại:{" "}
              <Text span fw={700} size="md">
                {patient?.phone ?? "---"}
              </Text>
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Ngày sinh:{" "}
              <Text span fw={700} size="md">
                {patient?.dob ? dayjs(patient.dob).format("DD/MM/YYYY") : "---"}
              </Text>
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Giới tính:{" "}
              <Text span fw={700} size="md">
                {patient?.gender === "MALE"
                  ? "Nam"
                  : patient?.gender === "FEMALE"
                  ? "Nữ"
                  : "---"}
              </Text>
            </Text>
          </Grid.Col>

          {/* Bạn có thể mở lại các trường dưới đây nếu cần */}
          {/* <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Ngày đăng ký: <Text span fw={700} size="md">---</Text>
            </Text>
          </Grid.Col> */}

          {/* <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Số đăng ký: <Text span fw={700} size="md">---</Text>
            </Text>
          </Grid.Col> */}

          {/* <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text span size="md">
              Địa chỉ: <Text span fw={700} size="md">---</Text>
            </Text>
          </Grid.Col> */}
        </Grid>
      </Paper>
    </>
  );
};

export default React.memo(PatientInfoPanel);
