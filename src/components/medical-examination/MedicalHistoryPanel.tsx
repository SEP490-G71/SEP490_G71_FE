// components/medical-examination/MedicalHistoryPanel.tsx
import { Loader, Modal, Paper, Text, Group, Select } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import { useMedicalHistoryByPatientId } from "../../hooks/medicalRecord/useMedicalHistoryByPatientId";
import { usePreviewMedicalRecord } from "../../hooks/medicalRecord/usePreviewMedicalRecord";
import { useSettingAdminService } from "../../hooks/setting/useSettingAdminService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // 👈 thêm icons

type Props = { patientId: string };

const MedicalHistoryPanel = ({ patientId }: Props) => {
  const { history, loading, error } = useMedicalHistoryByPatientId(patientId);
  const { previewMedicalRecord } = usePreviewMedicalRecord();
  const { setting } = useSettingAdminService();

  // --- pagination state (client side) ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Lấy danh sách size từ setting (giống CustomTable)
  const pageSizeOptions = useMemo(
    () => setting?.paginationSizeList ?? [5, 10, 20, 50],
    [setting]
  );

  // Khi setting sẵn sàng, set size mặc định theo option đầu tiên
  useEffect(() => {
    const first = pageSizeOptions?.[0];
    if (first && typeof first === "number") setPageSize(first);
  }, [pageSizeOptions]);

  // Reset trang khi đổi patient
  useEffect(() => {
    setPage(1);
  }, [patientId]);

  // Sort mới → cũ
  const rows = useMemo(() => {
    const list = history ?? [];
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [history]);

  const totalItems = rows.length;
  const totalPages = Math.max(
    1,
    Math.ceil(Math.max(0, totalItems) / Math.max(1, pageSize))
  );

  // Nếu đổi pageSize làm page vượt quá tổng trang, kéo về trang cuối
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = rows.slice(start, end);

  // Modal preview
  const [modalOpened, setModalOpened] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleOpenPreview = async (id: string) => {
    const url = await previewMedicalRecord(id);
    if (url) {
      setPdfUrl(url);
      setModalOpened(true);
    }
  };

  // ---------- PAGINATION (giống CustomTable) ----------
  const { startPage, endPage, showLeftEllipsis, showRightEllipsis } =
    useMemo(() => {
      const maxButtons = 3; // tối đa số nút trang hiển thị
      if (totalPages <= maxButtons) {
        return {
          startPage: 1,
          endPage: totalPages,
          showLeftEllipsis: false,
          showRightEllipsis: false,
        };
      }
      let start = Math.max(1, page - Math.floor(maxButtons / 2));
      let end = start + maxButtons - 1;
      if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxButtons + 1);
      }
      return {
        startPage: start,
        endPage: end,
        showLeftEllipsis: start > 1,
        showRightEllipsis: end < totalPages,
      };
    }, [page, totalPages]);
  // ---------------------------------------------------

  if (loading) return <Loader size="sm" />;
  if (error) return <Text c="red">{error}</Text>;
  if (!rows.length)
    return (
      <Text size="sm" c="dimmed">
        Chưa có lịch sử khám.
      </Text>
    );

  return (
    <>
      {/* Danh sách dạng card */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pageRows.map((item) => (
          <Paper
            key={item.id}
            p="sm"
            withBorder
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenPreview(item.id)}
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

      {/* Thanh phân trang kiểu CustomTable */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-0 py-4 text-sm text-gray-600 dark:text-gray-300">
        {/* Select page size (giữ đồng bộ với setting) */}
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Hiển thị
          </Text>
          <Select
            value={String(pageSize)}
            onChange={(v) => {
              const val = Number(v);
              setPageSize(val);
              setPage(1); // đổi size → về trang 1
            }}
            data={pageSizeOptions.map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            w={90}
            size="xs"
            allowDeselect={false}
          />
          <Text size="sm" c="dimmed">
            trên {totalItems} kết quả
          </Text>
        </Group>

        {/* Nút Prev / Window pages / Next với ellipsis */}
        <div className="flex items-center flex-wrap justify-start gap-1 sm:gap-2 text-sm">
          <button
            type="button"
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Trang trước"
          >
            <FaChevronLeft />
          </button>

          {/* first page + left ellipsis */}
          {showLeftEllipsis && (
            <>
              <button
                type="button"
                onClick={() => setPage(1)}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                1
              </button>
              <span className="px-2 select-none">…</span>
            </>
          )}

          {/* pages window */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {p}
            </button>
          ))}

          {/* right ellipsis + last page */}
          {showRightEllipsis && (
            <>
              <span className="px-2 select-none">…</span>
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Trang sau"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Modal xem PDF */}
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
