import { useEffect, useState } from "react";
import { Button, Modal, Text, Group } from "@mantine/core";
import FeedbackDetailModal from "./FeedbackDetailModal";
import useMedicalServiceFeedbackByService from "../../../hooks/feedBack/ServiceFeedBack/useMedicalServiceFeedbackByService";
import useDeleteMedicalServiceFeedback from "../../../hooks/feedBack/ServiceFeedBack/useDeleteMedicalServiceFeedback";

type Props = {
  opened: boolean;
  onClose: () => void;
  serviceId?: string | null;
  serviceName?: string;
};

export default function ServiceFeedbackDetailModal({
  opened,
  onClose,
  serviceId,
  serviceName,
}: Props) {
  const { feedbacks, loading, error, fetchByServiceId, reset, removeLocal } =
    useMedicalServiceFeedbackByService();

  const { deleteById, loading: deleting } = useDeleteMedicalServiceFeedback();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (opened && serviceId) fetchByServiceId(serviceId);
    if (!opened) {
      reset();
      setConfirmOpen(false);
      setPendingId(null);
    }
  }, [opened, serviceId]);

  const askDelete = (id: string) => {
    setPendingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingId) return;
    const ok = await deleteById(pendingId);
    if (ok) {
      removeLocal(pendingId);
      setConfirmOpen(false);
      setPendingId(null);
    }
  };

  return (
    <>
      <FeedbackDetailModal
        opened={opened}
        onClose={onClose}
        title={`Phản hồi dịch vụ: ${serviceName || ""}`}
        items={feedbacks}
        loading={loading}
        error={error || null}
        // mapping field: cố gắng lấy tên người đánh giá nếu có, fallback Ẩn danh
        getReviewerName={(i: any) => i.patientName || i.patientId || "Ẩn danh"}
        // service feedback có thể là rating (number) hoặc satisfactionLevel
        getLevel={(i: any) => i.satisfactionLevel ?? i.rating}
        getComment={(i: any) => i.comment}
        getCreatedAt={(i: any) => i.createdAt}
        keySelector={(i: any) => i.id}
        renderActions={(i: any) => (
          <Button
            size="xs"
            variant="light"
            color="red"
            onClick={() => askDelete(i.id)}
            disabled={deleting}
          >
            Xoá
          </Button>
        )}
      />

      {/* Modal confirm xoá */}
      <Modal
        opened={confirmOpen}
        onClose={() => {
          if (!deleting) {
            setConfirmOpen(false);
            setPendingId(null);
          }
        }}
        title="Xác nhận xoá phản hồi"
        centered
        size="sm"
      >
        <Text size="sm" mb="md">
          Bạn có chắc muốn xoá phản hồi này? Hành động không thể hoàn tác.
        </Text>
        <Group justify="flex-end">
          <Button
            variant="default"
            onClick={() => {
              setConfirmOpen(false);
              setPendingId(null);
            }}
            disabled={deleting}
          >
            Huỷ
          </Button>
          <Button color="red" loading={deleting} onClick={handleConfirmDelete}>
            Xoá
          </Button>
        </Group>
      </Modal>
    </>
  );
}
