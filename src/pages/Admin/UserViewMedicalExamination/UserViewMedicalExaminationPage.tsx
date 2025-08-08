import React, { useEffect, useState } from "react";
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
        {`${row.index + 1}`}
      </span>
    ),
    align: "left",
  },
  {
    key: "fullName",
    label: "Họ và tên",
    align: "left",
    render: (row) => (
      <span className="font-digital text-base">{row.fullName}</span>
    ),
  },
  {
    key: "queueOrder",
    label: "Thứ tự khám",
    render: (row) => (
      <span className="font-digital text-base">{`${row.queueOrder}`}</span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (row) => (
      <span
        className="font-digital"
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  const getProcessedQueuePatients = (): Record<
    string,
    QueuePatientsResponse[]
  > => {
    const grouped: Record<string, QueuePatientsResponse[]> = {};
    queuePatients.forEach((p) => {
      const key = p.roomNumber?.toString() ?? "NO_ROOM";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });

    const result: Record<string, QueuePatientsResponse[]> = {};
    Object.entries(grouped).forEach(([room, group]) => {
      const sorted = [...group].sort((a, b) => {
        const priority = (status: string) => {
          if (status === "WAITING") return 0;
          if (status === "CALLING") return 1;
          if (status === "IN_PROGRESS") return 2;
          if (status === "DONE") return 99;
          if (status === "CANCELED") return 100;
          return 50;
        };
        return priority(a.status) - priority(b.status);
      });

      const updated = sorted.map((p) => {
        const modified = { ...p };
        if (p.status === "WAITING" && p.calledTime) {
          modified.status = "CALLING";
        }
        return modified;
      });

      result[room] = updated;
    });

    return result;
  };

  const groupedPatients = getProcessedQueuePatients();

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
              const paginatedPatients = patients
                .slice((page - 1) * pageSize, page * pageSize)
                .map((p, i) => ({ ...p, index: (page - 1) * pageSize + i }));

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
                      pageSize={pageSize}
                      totalItems={patients.length}
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
