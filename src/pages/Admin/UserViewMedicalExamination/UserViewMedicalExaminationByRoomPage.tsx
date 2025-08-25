import React, { useEffect, useRef, useState } from "react";
import { QueuePatientsResponse } from "../../../types/Admin/UserViewMedicalExamination/UserViewMedicalExamination";
import CustomTable from "../../../components/common/CustomTable";
import { Column } from "../../../types/table";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { Title } from "@mantine/core";
import useMyDepartment from "../../../hooks/department-service/useMyDepartment";
import useQueuePatientsByRoom from "../../../hooks/queue-patients/useQueuePatientsByRoom";
import { speakWithViettel } from "../../../hooks/tts";

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

const UserViewMedicalExaminationByRoomPage: React.FC = () => {
  const { department, loading: deptLoading } = useMyDepartment();
  const roomId = department?.id || "";
  const { queuePatients, loading: queueLoading } =
    useQueuePatientsByRoom(roomId);

  const { setting } = useSettingAdminService();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  const loading = deptLoading || queueLoading;

  const announcersRef = useRef<Map<string, { timer: number; count: number }>>(
    new Map()
  );
  const INTERVAL_MS = 10000;
  const MAX_REPEATS = Infinity;

  useEffect(() => {
    if (!queuePatients?.length) {
      for (const { timer } of announcersRef.current.values())
        clearInterval(timer);
      announcersRef.current.clear();
      return;
    }

    const activeKeys = new Set<string>();

    queuePatients.forEach((p) => {
      const isCalling =
        p.status === "CALLING" || (p.status === "WAITING" && !!p.calledTime);
      if (!isCalling) return;

      const key = `${p.id || p.fullName}-${p.calledTime || ""}`;
      activeKeys.add(key);

      if (!announcersRef.current.has(key)) {
        const entry = { timer: 0 as unknown as number, count: 0 };
        const roomNo = department?.roomNumber
          ? `phòng ${department.roomNumber}`
          : "phòng khám";
        const text = `Mời bệnh nhân ${p.fullName} vào ${roomNo}.`;

        const run = () => {
          if (entry.count >= MAX_REPEATS) {
            clearInterval(entry.timer);
            announcersRef.current.delete(key);
            return;
          }
          entry.count += 1;
          speakWithViettel(text).catch(() => {});
        };

        run();
        entry.timer = window.setInterval(run, INTERVAL_MS);
        announcersRef.current.set(key, entry);
      }
    });

    for (const [key, entry] of announcersRef.current.entries()) {
      if (!activeKeys.has(key)) {
        clearInterval(entry.timer);
        announcersRef.current.delete(key);
      }
    }

    return () => {
      for (const { timer } of announcersRef.current.values())
        clearInterval(timer);
      announcersRef.current.clear();
    };
  }, [queuePatients, department?.roomNumber]);

  const processedPatients = (() => {
    const sorted = [...(queuePatients || [])].sort((a, b) => {
      const priority = (status: string) => {
        if (status === "WAITING") return 0;
        if (status === "CALLING") return 1;
        if (status === "IN_PROGRESS") return 2;
        if (status === "AWAITING_RESULT") return 3;
        if (status === "DONE") return 99;
        if (status === "CANCELED") return 100;
        return 50;
      };
      return priority(a.status) - priority(b.status);
    });

    return sorted.map((p) => {
      const modified = { ...p };
      if (p.status === "WAITING" && p.calledTime) {
        modified.status = "CALLING";
      }
      return modified;
    });
  })();

  const paginatedPatients = processedPatients
    .slice((page - 1) * pageSize, page * pageSize)
    .map((p, i) => ({ ...p, index: (page - 1) * pageSize + i }));

  return (
    <div style={{ minHeight: "100vh", width: "100%", margin: 0, padding: 0 }}>
      <Title
        order={3}
        className="text-xl font-semibold"
        ta="center"
        style={{ marginBottom: "1rem" }}
      >
        Danh sách bệnh nhân — Phòng {department?.roomNumber || "?"} —{" "}
        {department?.name || "Chưa xác định"}
      </Title>

      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "1rem" }}>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <CustomTable
              data={paginatedPatients}
              columns={columns}
              page={page}
              pageSize={pageSize}
              totalItems={processedPatients.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              showActions={false}
              pageSizeOptions={setting?.paginationSizeList
                ?.slice()
                .sort((a, b) => a - b)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserViewMedicalExaminationByRoomPage;
