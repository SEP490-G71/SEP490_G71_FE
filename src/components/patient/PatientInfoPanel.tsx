import { Button, Grid, Group, Text, Modal } from "@mantine/core";
import { useState } from "react";
import dayjs from "dayjs";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";
import PatientActionButtons from "./PatientActionButtons";

interface Props {
  patient?: QueuePatient | null;
  onCallPatient?: () => void;
  onCancelQueue?: () => void;
  onConfirm?: () => void;
  mode?: "billing" | "examination" | "clinical";
}

const PatientInfoPanel = ({
  patient,
  onConfirm,
  onCancelQueue,
  onCallPatient,
  mode,
}: Props) => {
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [cancelModalOpened, setCancelModalOpened] = useState(false);

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

        {patient && mode === "examination" && (
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <PatientActionButtons
              patient={patient}
              onCallPatient={onCallPatient}
              onCancelQueue={onCancelQueue}
              onConfirmStartExamination={onConfirm}
            />
          </Grid.Col>
        )}
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

      {/* Modal huỷ lượt khám */}
      <Modal
        opened={cancelModalOpened}
        onClose={() => setCancelModalOpened(false)}
        title="Huỷ lượt khám"
        centered
      >
        <Text>Bạn có chắc chắn muốn huỷ lượt khám này?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="outline" onClick={() => setCancelModalOpened(false)}>
            Huỷ
          </Button>
          <Button
            color="red"
            onClick={() => {
              setCancelModalOpened(false);
              onCancelQueue?.();
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
