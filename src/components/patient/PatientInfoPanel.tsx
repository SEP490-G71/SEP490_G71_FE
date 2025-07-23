import { Grid, Group, Text } from "@mantine/core";
import React from "react";
import dayjs from "dayjs";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";

interface Props {
  patient: QueuePatient | null;
  onEndExamination?: () => void;
}

const PatientInfoPanel = ({ patient }: Props) => {
  return (
    <>
      <Group mb="xs" gap="xs" style={{ fontSize: "14px" }}></Group>

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

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            SDT:{" "}
            <Text span fw={700} size="md">
              {patient?.phone ?? "---"}
            </Text>
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            Chuyên khoa:{" "}
            <Text span fw={700} size="md">
              {patient?.specialization}
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
            Ngày đăng kí:{" "}
            <Text span fw={700} size="md">
              {patient?.registeredTime
                ? dayjs(patient.registeredTime).format("DD/MM/YYYY")
                : "---"}
            </Text>
          </Text>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default React.memo(PatientInfoPanel);
