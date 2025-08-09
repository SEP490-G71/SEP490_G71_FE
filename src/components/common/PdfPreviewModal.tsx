import { Modal } from "@mantine/core";
import { useEffect, useMemo } from "react";

interface PdfPreviewModalProps {
  opened: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;

  widthPct?: number;

  heightVh?: number;

  keepMounted?: boolean;
}

const PdfPreviewModal = ({
  opened,
  onClose,
  pdfUrl,
  title,
  widthPct = 90,
  heightVh = 90,
  keepMounted = true,
}: PdfPreviewModalProps) => {
  const isBlobUrl = useMemo(
    () => (pdfUrl ? pdfUrl.startsWith("blob:") : false),
    [pdfUrl]
  );

  const handleClose = () => {
    if (isBlobUrl && pdfUrl) URL.revokeObjectURL(pdfUrl);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (isBlobUrl && pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [isBlobUrl, pdfUrl]);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title || "Xem trước PDF"}
      size={`${widthPct}%`}
      centered
      keepMounted={keepMounted}
      radius="md"
      styles={{
        body: { padding: 0 },
        content: { maxWidth: `${widthPct}vw` },
      }}
    >
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          style={{
            width: "100%",
            height: `${heightVh}vh`,
            border: "none",
          }}
        />
      ) : (
        <div className="p-4 text-sm text-gray-600">
          Không có nội dung để hiển thị.
        </div>
      )}
    </Modal>
  );
};

export default PdfPreviewModal;
