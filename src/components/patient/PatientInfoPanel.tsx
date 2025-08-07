import { Button, Grid, Group, Text, Modal } from "@mantine/core";
import { useState } from "react";
import dayjs from "dayjs";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";

interface Props {
  patient?: QueuePatient | null;
  onCallPatient?: () => void;
  onCancelQueue?: () => void;
  onConfirm?: () => void;
  mode?: "billing" | "examination" | "clinical";
}

const PatientInfoPanel = ({ patient, onConfirm }: Props) => {
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const code = patient?.patientCode ?? "---";
  const fullName = patient?.fullName ?? "---";
  const gender = patient?.gender ?? undefined;
  const dob = patient?.dob ?? null;
  const phone = patient?.phone ?? "---";
  const specialization = patient?.specialization ?? "---";
  const registeredTime = patient?.registeredTime ?? null;

  return (
    <>
      <Group mb="xs" gap="xs" style={{ fontSize: "14px" }}></Group>

      <Grid gutter="xs">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            Mã BN:{" "}
            <Text span fw={700}>
              {code}
            </Text>
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            Họ tên:{" "}
            <Text span fw={700}>
              {fullName}
            </Text>
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            Giới tính:{" "}
            <Text span fw={700}>
              {gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : "---"}
            </Text>
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            SDT:{" "}
            <Text span fw={700}>
              {phone}
            </Text>
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            Chuyên khoa:{" "}
            <Text span fw={700}>
              {specialization}
            </Text>
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            Ngày sinh:{" "}
            <Text span fw={700}>
              {dob ? dayjs(dob).format("DD/MM/YYYY") : "---"}
            </Text>
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text span size="md">
            Ngày đăng kí:{" "}
            <Text span fw={700}>
              {registeredTime
                ? dayjs(registeredTime).format("DD/MM/YYYY")
                : "---"}
            </Text>
          </Text>
        </Grid.Col>
      </Grid>

      {/* Modal xác nhận vào khám */}
      <Modal
        opened={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
        title="Xác nhận vào khám"
        centered
      >
        <Text>
          Bạn có chắc chắn muốn chuyển sang trạng thái Đang khám không?
        </Text>
        <Group mt="md" justify="flex-end">
          <Button
            variant="outline"
            onClick={() => setConfirmModalOpened(false)}
          >
            Huỷ
          </Button>
          <Button
            color="teal"
            onClick={() => {
              setConfirmModalOpened(false);
              onConfirm?.();
            }}
          >
            Đồng ý
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default PatientInfoPanel;
