import React, { useEffect, useMemo, useState } from "react";
import useUserViewMedicalExamination from "../../../hooks/UserViewMedicalExamination/useUserViewMedicalExamination";
import { QueuePatientsResponse } from "../../../types/Admin/UserViewMedicalExamination/UserViewMedicalExamination";
import CustomTable from "../../../components/common/CustomTable";
import { Column } from "../../../types/table";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { Title } from "@mantine/core";

const statusColor = (status: string): string => {
  switch (status) {
    case "WAITING":
      return "#FFE082";
    case "CALLING":
      return "#FFB74D";
    case "IN_PROGRESS":
      return "#64B5F6";
    case "AWAITING_RESULT":
      return "#E0B0FF";
    case "DONE":
      return "#81C784";
    case "CANCELED":
      return "#EF5350";
    default:
      return "#E0E0E0";
  }
};

const statusTextColor = (): string => "#000";

const statusLabel = (status: string): string => {
  switch (status) {
    case "WAITING":
      return "🕐 Chờ khám";
    case "CALLING":
      return "📢 Đang gọi";
    case "IN_PROGRESS":
      return "🧪 Đang khám";
    case "AWAITING_RESULT":
      return "⏳ Chờ kết quả";
    case "DONE":
      return "✔️ Đã khám";
    case "CANCELED":
      return "🚫 Đã qua lượt";
    default:
      return status;
  }
};

const columns: Column<QueuePatientsResponse & { index: number }>[] = [
  {
    key: "index",
    label: "STT",
    render: (row) => (
      <span className="font-digital text-base font-medium">
        {row.index + 1}
      </span>
    ),
    align: "left",
  },
  {
    key: "fullName",
    label: "Họ và tên",
    align: "left",
    render: (row) => <span className="text-base">{row.fullName}</span>,
  },
  {
    key: "queueOrder",
    label: "Thứ tự khám",
    render: (row) => (
      <span className="font-digital text-base">{row.queueOrder}</span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (row) => (
      <span
        style={{
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: "6px",
          backgroundColor: statusColor(row.status),
          color: statusTextColor(),
          display: "inline-block",
        }}
      >
        {statusLabel(row.status)}
      </span>
    ),
    align: "left",
  },
];

const UserViewMedicalExaminationPage: React.FC = () => {
  const { queuePatients, loading } = useUserViewMedicalExamination();
  const { setting } = useSettingAdminService();

  const [roomPage, setRoomPage] = useState<Record<string, number>>({});
  const [roomPageSize, setRoomPageSize] = useState<Record<string, number>>({});

  // pageSize mặc định
  const defaultPageSize = useMemo(
    () =>
      setting?.paginationSizeList?.length ? setting.paginationSizeList[0] : 5,
    [setting]
  );

  const groupedPatients = useMemo(() => {
    const grouped: Record<string, QueuePatientsResponse[]> = {};
    queuePatients.forEach((p) => {
      const key = p.roomNumber?.toString() ?? "NO_ROOM";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });

    const result: Record<string, QueuePatientsResponse[]> = {};
    Object.entries(grouped).forEach(([room, group]) => {
      const priority = (status: string) => {
        if (status === "WAITING") return 0;
        if (status === "CALLING") return 1;
        if (status === "IN_PROGRESS") return 2;
        if (status === "AWAITING_RESULT") return 3;
        if (status === "DONE") return 99;
        if (status === "CANCELED") return 100;
        return 50;
      };
      const sorted = [...group].sort(
        (a, b) => priority(a.status) - priority(b.status)
      );
      const updated = sorted.map((p) =>
        p.status === "WAITING" && p.calledTime ? { ...p, status: "CALLING" } : p
      );
      result[room] = updated;
    });

    return result;
  }, [queuePatients]);

  useEffect(() => {
    const nextPages: Record<string, number> = { ...roomPage };
    const nextSizes: Record<string, number> = { ...roomPageSize };

    Object.keys(groupedPatients).forEach((room) => {
      if (!nextPages[room]) nextPages[room] = 1;
      if (!nextSizes[room]) nextSizes[room] = defaultPageSize;
    });

    // Thu gọn state nếu phòng biến mất
    Object.keys(nextPages).forEach((room) => {
      if (!groupedPatients[room]) {
        delete nextPages[room];
        delete nextSizes[room];
      }
    });

    setRoomPage(nextPages);
    setRoomPageSize(nextSizes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedPatients, defaultPageSize]);

  // Khi tổng số bản ghi giảm, đảm bảo trang hiện tại không vượt quá tổng trang
  useEffect(() => {
    const nextPages: Record<string, number> = { ...roomPage };
    Object.entries(groupedPatients).forEach(([room, list]) => {
      const size = roomPageSize[room] ?? defaultPageSize;
      const totalPages = Math.max(1, Math.ceil(list.length / size));
      if ((roomPage[room] ?? 1) > totalPages) nextPages[room] = totalPages;
    });
    setRoomPage(nextPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedPatients, roomPageSize, defaultPageSize]);

  const getPage = (room: string) => roomPage[room] ?? 1;
  const getPageSize = (room: string) => roomPageSize[room] ?? defaultPageSize;

  return (
    <div>
      <style>
        {`
          @media (min-width: 1024px) {
            .responsive-room-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}
      </style>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <Title order={3} className="text-xl font-semibold">
              Danh sách bệnh nhân theo phòng
            </Title>
          </div>

          <div
            className="responsive-room-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100%, 1fr))",
              gap: "2rem",
              alignItems: "stretch",
            }}
          >
            {Object.entries(groupedPatients).map(([room, patients]) => {
              const page = getPage(room);
              const size = getPageSize(room);

              const paginatedPatients = patients
                .slice((page - 1) * size, page * size)
                .map((p, i) => ({ ...p, index: (page - 1) * size + i }));

              return (
                <div
                  key={room}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    backgroundColor: "#fff",
                    minHeight: room === "NO_ROOM" ? "100%" : "450px",
                    flex: room === "NO_ROOM" ? 1 : undefined,
                    alignSelf: room === "NO_ROOM" ? "stretch" : undefined,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      padding: "0.75rem",
                      backgroundColor: "#f7f7f7",
                      fontWeight: 600,
                    }}
                  >
                    Phòng: {room === "NO_ROOM" ? "Chưa phân phòng" : room}
                  </h3>

                  <div style={{ padding: "1rem" }}>
                    <CustomTable
                      data={paginatedPatients}
                      columns={columns}
                      page={page}
                      pageSize={size}
                      totalItems={patients.length}
                      onPageChange={(p) =>
                        setRoomPage((prev) => ({ ...prev, [room]: p }))
                      }
                      onPageSizeChange={(newSize) => {
                        setRoomPageSize((prev) => ({
                          ...prev,
                          [room]: newSize,
                        }));
                        setRoomPage((prev) => ({ ...prev, [room]: 1 })); // reset về trang 1 khi đổi size
                      }}
                      showActions={false}
                      pageSizeOptions={setting?.paginationSizeList
                        ?.slice()
                        .sort((a, b) => a - b)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default UserViewMedicalExaminationPage;
