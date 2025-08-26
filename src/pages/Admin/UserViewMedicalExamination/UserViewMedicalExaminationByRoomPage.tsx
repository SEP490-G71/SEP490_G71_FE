import React, { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { Column } from "../../../types/table";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import useMyDepartment from "../../../hooks/department-service/useMyDepartment";
import useQueuePatientsByRoom from "../../../hooks/queue-patients/useQueuePatientsByRoom";
import { speakWithViettel } from "../../../hooks/tts";
import { QueuePatientsResponse } from "../../../types/Admin/UserViewMedicalExamination/UserViewMedicalExamination";

const statusColor = (s: string) =>
  s === "WAITING"
    ? "#FFE082"
    : s === "CALLING"
    ? "#FFB74D"
    : s === "IN_PROGRESS"
    ? "#64B5F6"
    : s === "AWAITING_RESULT"
    ? "#E0B0FF"
    : s === "DONE"
    ? "#81C784"
    : s === "CANCELED"
    ? "#EF5350"
    : "#E0E0E0";
const statusTextColor = () => "#000";
const statusLabel = (s: string) =>
  s === "WAITING"
    ? "🕐 Chờ khám"
    : s === "CALLING"
    ? "📢 Đang gọi"
    : s === "IN_PROGRESS"
    ? "🧪 Đang khám"
    : s === "AWAITING_RESULT"
    ? "⏳ Chờ kết quả"
    : s === "DONE"
    ? "✔️ Đã khám"
    : s === "CANCELED"
    ? "🚫 Đã qua lượt"
    : s;

const columns: Column<QueuePatientsResponse & { index: number }>[] = [
  {
    key: "index",
    label: "STT",
    align: "left",
    render: (row) => (
      <span className="font-digital text-base font-medium">
        {row.index + 1}
      </span>
    ),
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
    align: "left",
    render: (row) => (
      <span className="font-digital text-base" style={{ paddingLeft: 25 }}>
        {row.queueOrder}
      </span>
    ),
  },
  {
    key: "isPriority",
    label: "Ưu tiên",
    align: "left",
    render: (row) => (
      <span
        className="text-base"
        style={{
          paddingLeft: 20,
          fontWeight: 600,
          color: row.isPriority ? "green" : "red",
        }}
      >
        {row.isPriority ? "✔️" : "--"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    align: "left",
    render: (row) => (
      <span
        style={{
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: 6,
          backgroundColor: statusColor(row.status),
          color: statusTextColor(),
          display: "inline-block",
        }}
      >
        {statusLabel(row.status)}
      </span>
    ),
  },
];

const UserViewMedicalExaminationByRoomPage: React.FC = () => {
  const { department, loading: deptLoading } = useMyDepartment();
  const roomId = department?.id || "";

  const {
    queuePatients,
    loading: queueLoading,
    refetch,
  } = useQueuePatientsByRoom(roomId);

  const { setting } = useSettingAdminService();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (setting?.paginationSizeList?.length)
      setPageSize(setting.paginationSizeList[0]);
  }, [setting]);

  const loading = deptLoading || queueLoading;

  const processedPatients = useMemo(() => {
    const pri = (s: string) =>
      s === "WAITING"
        ? 0
        : s === "CALLING"
        ? 1
        : s === "IN_PROGRESS"
        ? 2
        : s === "AWAITING_RESULT"
        ? 3
        : s === "DONE"
        ? 99
        : s === "CANCELED"
        ? 100
        : 50;

    const normalized = (queuePatients || []).map((p) =>
      p.status === "WAITING" && p.calledTime
        ? { ...p, status: "CALLING" as const }
        : p
    );

    normalized.sort((a, b) => {
      const byStatus = pri(a.status) - pri(b.status);
      if (byStatus) return byStatus;
      const qa = typeof a.queueOrder === "number" ? a.queueOrder : 1e9;
      const qb = typeof b.queueOrder === "number" ? b.queueOrder : 1e9;
      if (qa !== qb) return qa - qb;
      const ra = a.registeredTime ? new Date(a.registeredTime).getTime() : 9e15;
      const rb = b.registeredTime ? new Date(b.registeredTime).getTime() : 9e15;
      return ra - rb;
    });

    return normalized;
  }, [queuePatients]);

  const paginatedPatients = useMemo(
    () =>
      processedPatients
        .slice((page - 1) * pageSize, page * pageSize)
        .map((p, i) => ({ ...p, index: (page - 1) * pageSize + i })),
    [processedPatients, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [queuePatients]);

  // ========== TTS runner duy nhất: đọc 1 vòng → refetch → lặp ==========
  const latestPatientsRef = useRef<QueuePatientsResponse[]>([]);
  useEffect(() => {
    latestPatientsRef.current = queuePatients ?? [];
  }, [queuePatients]);

  const runVersionRef = useRef(0);
  const LULL_POLL_MS = 5000; // khi không ai CALLING
  const BETWEEN_PERSON_MS = 800; // nghỉ giữa 2 người
  const GUARD_MS = 3200; // ước lượng thời lượng 1 câu

  const makeSpeech = (p: QueuePatientsResponse) => {
    const roomNo = department?.roomNumber
      ? `phòng ${department.roomNumber}`
      : "phòng khám";
    return `Mời bệnh nhân ${p.fullName} vào ${roomNo}.`;
  };

  useEffect(() => {
    // khởi động runner mỗi khi room thay đổi
    runVersionRef.current += 1;
    const myVersion = runVersionRef.current;
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const t = setTimeout(r, ms);
        // nếu bị cancel thì kết thúc sớm
        const stop = () => {
          clearTimeout(t);
          r();
        };
        if (cancelled || myVersion !== runVersionRef.current) stop();
      });

    const getCallers = () => {
      const list = latestPatientsRef.current || [];
      return list
        .filter(
          (p) =>
            p.status === "CALLING" || (p.status === "WAITING" && !!p.calledTime)
        )
        .sort((a, b) => {
          const qa = typeof a.queueOrder === "number" ? a.queueOrder : 1e9;
          const qb = typeof b.queueOrder === "number" ? b.queueOrder : 1e9;
          return qa - qb;
        });
    };

    (async () => {
      while (!cancelled && myVersion === runVersionRef.current) {
        if (document.hidden) {
          await sleep(500);
          continue;
        }

        const callers = getCallers();

        if (callers.length === 0) {
          // không ai CALLING → chờ 5s rồi refetch
          await sleep(LULL_POLL_MS);
          if (cancelled || myVersion !== runVersionRef.current) break;
          try {
            await refetch?.();
          } catch {}
          continue;
        }

        // có người → đọc 1 vòng snapshot
        for (const p of callers) {
          if (cancelled || myVersion !== runVersionRef.current) break;
          if (document.hidden) break;
          try {
            await speakWithViettel(makeSpeech(p));
          } catch {}
          await sleep(GUARD_MS);
          if (cancelled || myVersion !== runVersionRef.current) break;
          await sleep(BETWEEN_PERSON_MS);
          if (cancelled || myVersion !== runVersionRef.current) break;
        }

        if (cancelled || myVersion !== runVersionRef.current) break;
        // kết thúc 1 vòng → refetch rồi lặp
        try {
          await refetch?.();
        } catch {}
      }
    })();

    return () => {
      cancelled = true;
      runVersionRef.current += 1;
    };
  }, [department?.roomNumber, refetch]);

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
          borderRadius: 12,
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
                ?.sort((a, b) => a - b)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserViewMedicalExaminationByRoomPage;
