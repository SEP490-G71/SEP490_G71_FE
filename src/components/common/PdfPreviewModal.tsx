import { Modal } from "@mantine/core";
import { useEffect } from "react";

interface PdfPreviewModalProps {
  opened: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;
}

const PdfPreviewModal = ({
  opened,
  onClose,
  pdfUrl,
  title,
}: PdfPreviewModalProps) => {
  useEffect(() => {
    return () => {
      // Cleanup blob when modal closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={title || "Xem trước PDF"}
      centered
    >
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          style={{ width: "100%", height: "80vh", border: "none" }}
          title="PDF Preview"
        />
      ) : (
        <p>Không có nội dung để hiển thị.</p>
      )}
    </Modal>
  );
};

export default PdfPreviewModal;
