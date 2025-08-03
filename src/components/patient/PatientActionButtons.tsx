import { Button, Group, Modal, Text } from "@mantine/core";
import { useState } from "react";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";

interface Props {
  patient: QueuePatient | null;
  onConfirmStartExamination?: () => void;
  onCancelQueue?: () => void;
  onCallPatient?: () => void;
}

const PatientActionButtons = ({
  patient,
  onCallPatient,
  onCancelQueue,
  onConfirmStartExamination,
}: Props) => {
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [cancelModalOpened, setCancelModalOpened] = useState(false);

  const isDisabled =
    patient?.status === "IN_PROGRESS" ||
    patient?.status === "DONE" ||
    patient?.status === "CANCELED";

  if (isDisabled) return null;

  return (
    <>
      <Group gap="xs">
        {patient?.status === "WAITING" && (
          <Button size="xs" color="blue" onClick={onCallPatient}>
            Gọi khám
          </Button>
        )}

        {patient?.status === "CALLING" && (
          <>
            <Button
              size="xs"
              color="teal"
              onClick={() => setConfirmModalOpened(true)}
            >
              Vào khám
            </Button>
            <Button
              size="xs"
              color="red"
              variant="outline"
              onClick={() => setCancelModalOpened(true)}
            >
              Huỷ
            </Button>
          </>
        )}
      </Group>

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
              onConfirmStartExamination?.();
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

export default PatientActionButtons;
