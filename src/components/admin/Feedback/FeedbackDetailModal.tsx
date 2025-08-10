import { Modal, Badge, Group, Stack, Loader, Alert } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";

type Get<T> = (item: T) => string | number | undefined | null;

export interface FeedbackDetailModalProps<T = any> {
  opened: boolean;
  onClose: () => void;
  title?: string;

  items: T[];
  loading?: boolean;
  error?: string | null;

  getReviewerName?: Get<T>;
  getLevel?: Get<T>;
  getComment?: Get<T>;
  getCreatedAt?: Get<T>;

  emptyText?: string;
  formatDate?: (val: string | number | Date | undefined | null) => string;
  levelLabel?: (val: string | number | undefined | null) => string;
  levelColor?: (val: string | number | undefined | null) => string;
  keySelector?: (item: T, idx: number) => string | number;

  renderActions?: (item: T) => React.ReactNode;
}

const defaultFormatDate = (v: any) =>
  v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "";

const defaultLevelLabel = (v: any) => {
  const x = String(v ?? "").toUpperCase();
  switch (x) {
    case "VERY_BAD":
      return "Rất kém";
    case "BAD":
      return "Kém";
    case "AVERAGE":
      return "Trung bình";
    case "GOOD":
      return "Tốt";
    case "EXCELLENT":
      return "Tuyệt vời";
    default:
      if (typeof v === "number") return `${v.toFixed ? v.toFixed(1) : v}/5`;
      return v ? String(v) : "-";
  }
};

const defaultLevelColor = (v: any) => {
  const x = String(v ?? "").toUpperCase();
  if (x === "EXCELLENT") return "green";
  if (x === "GOOD") return "teal";
  if (x === "AVERAGE") return "indigo";
  if (x === "BAD") return "orange";
  if (x === "VERY_BAD") return "red";
  if (typeof v === "number") return "blue";
  return "gray";
};

export default function FeedbackDetailModal<T>({
  opened,
  onClose,
  title = "Chi tiết phản hồi",
  items,
  loading,
  error,
  getReviewerName = (i: any) => i?.patientName ?? "Ẩn danh",
  getLevel = (i: any) => i?.satisfactionLevel ?? i?.rating,
  getComment = (i: any) => i?.comment,
  getCreatedAt = (i: any) => i?.createdAt,
  emptyText = "Chưa có phản hồi",
  formatDate = defaultFormatDate,
  levelLabel = defaultLevelLabel,
  levelColor = defaultLevelColor,
  keySelector = (_: any, idx: number) => idx,
  renderActions,
}: FeedbackDetailModalProps<T>) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="xl" // rộng hơn
      centered
      styles={{
        content: { minHeight: "420px" }, // cao hơn
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader size="sm" /> <span>Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <Alert color="red">{error}</Alert>
      ) : !items?.length ? (
        <Alert color="gray">{emptyText}</Alert>
      ) : (
        <Stack gap="sm">
          {items.map((item, idx) => {
            const name = getReviewerName(item) || "Ẩn danh";
            const level = getLevel(item);
            const comment = getComment(item);
            const createdAt = getCreatedAt(item);

            return (
              <div
                key={keySelector(item, idx)}
                className="rounded-md border p-3 flex flex-col gap-2"
              >
                <Group justify="space-between" align="center">
                  <div className="font-medium">{String(name)}</div>
                  <Badge color={levelColor(level)}>{levelLabel(level)}</Badge>
                </Group>

                {comment ? (
                  <div className="text-sm text-gray-700">{String(comment)}</div>
                ) : (
                  <div className="text-sm text-gray-400 italic">
                    Không có nhận xét
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {formatDate(createdAt as any)}
                </div>

                {renderActions && (
                  <div className="flex justify-end">{renderActions(item)}</div>
                )}
              </div>
            );
          })}
        </Stack>
      )}
    </Modal>
  );
}
