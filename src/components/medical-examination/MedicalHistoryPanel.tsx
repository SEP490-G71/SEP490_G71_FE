import { Loader, Modal, Paper, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";

import { useMedicalHistoryByPatientId } from "../../hooks/medicalRecord/useMedicalHistoryByPatientId";
import { usePreviewMedicalRecord } from "../../hooks/medicalRecord/usePreviewMedicalRecord";

type Props = {
  patientId: string;
};

const MedicalHistoryPanel = ({ patientId }: Props) => {
  const { history, loading, error } = useMedicalHistoryByPatientId(patientId);
  const { previewMedicalRecord } = usePreviewMedicalRecord();
  const [modalOpened, setModalOpened] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleClick = async (id: string) => {
    const url = await previewMedicalRecord(id);
    if (url) {
      setPdfUrl(url);
      setModalOpened(true);
    }
  };

  if (loading) return <Loader size="sm" />;
  if (error) return <Text color="red">{error}</Text>;

  if (history.length === 0)
    return (
      <Text size="sm" c="dimmed">
        Chưa có lịch sử khám.
      </Text>
    );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map((item) => (
          <Paper
            key={item.id}
            p="sm"
            withBorder
            style={{ cursor: "pointer" }}
            onClick={() => handleClick(item.id)}
          >
            <Text size="sm" fw={600}>
              Ngày khám: {dayjs(item.createdAt).format("DD/MM/YYYY")}
            </Text>
            <Text size="sm">Bác sĩ: {item.doctorName}</Text>
            <Text size="sm" c="dimmed">
              Mã hồ sơ: {item.medicalRecordCode}
            </Text>
          </Paper>
        ))}
      </div>

      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setPdfUrl(null);
        }}
        title="Xem trước hồ sơ bệnh án"
        size="90%"
        centered
        overlayProps={{ blur: 2, backgroundOpacity: 0.55 }}
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            title="Medical Record PDF"
            width="100%"
            height="600px"
            style={{ border: "none", borderRadius: 6 }}
          />
        )}
      </Modal>
    </>
  );
};

export default MedicalHistoryPanel;
