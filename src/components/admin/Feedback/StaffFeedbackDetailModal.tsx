import { useEffect, useState } from "react";
import { Button, Modal, Text, Group } from "@mantine/core";
import FeedbackDetailModal from "./FeedbackDetailModal";
import useStaffFeedbackByStaff from "../../../hooks/feedBack/StaffFeedBack/useStaffFeedbackByStaff";
import useDeleteStaffFeedback from "../../../hooks/feedBack/StaffFeedBack/useDeleteStaffFeedback";

type Props = {
  opened: boolean;
  onClose: () => void;
  staffId?: string | null;
  staffName?: string;
};

export default function StaffFeedbackDetailModal({
  opened,
  onClose,
  staffId,
  staffName,
}: Props) {
  const { feedbacks, loading, error, fetchByStaffId, reset, removeLocal } =
    useStaffFeedbackByStaff();

  const { deleteById, loading: deleting } = useDeleteStaffFeedback();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (opened && staffId) fetchByStaffId(staffId);
    if (!opened) {
      reset();
      setConfirmOpen(false);
      setPendingId(null);
    }
  }, [opened, staffId]);

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
        title={`Phản hồi về: ${staffName || ""}`}
        items={feedbacks}
        loading={loading}
        error={error || null}
        getReviewerName={(i: any) => i.patientName || "Ẩn danh"}
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
