import dayjs from "dayjs";
import CustomTable from "../common/CustomTable";
import { Column } from "../../types/table";
import { RoomTransferRow } from "../../types/RoomTranfer/RoomTransfer";
import {
  MedicalRecordStatus,
  MedicalRecordStatusColor,
  MedicalRecordStatusMap,
} from "../../enums/MedicalRecord/MedicalRecordStatus";
import { Badge } from "@mantine/core";

type Props = {
  rows: RoomTransferRow[];
  page: number;
  pageSize: number;
  totalItems: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  selectedId?: string | null; // có thể là transferId HOẶC medicalRecordId (giữ tương thích ngược)
  onRowClick?: (
    row: RoomTransferRow & { index: number; transferId: string }
  ) => void;
};

const TranferPatientList = ({
  rows,
  page,
  pageSize,
  totalItems,
  loading,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  selectedId,
}: Props) => {
  // ✅ ĐỪNG ghi đè id = medicalRecordId. Giữ nguyên r.id (transferId)
  const data = rows.map((r, idx) => ({
    ...r,
    index: (page - 1) * pageSize + idx,
    transferId: r.id, // giữ lại transferId rõ ràng
    id: r.id, // dùng id (transferId) làm key cho bảng
    // Yêu cầu: r phải có sẵn fromDepartmentId, toDepartmentId, fromRoomNumber, toRoomNumber, ...
  }));

  const CELL_STYLE: React.CSSProperties = {
    fontSize: 16,
    lineHeight: 1.6,
  };

  const columns: Column<
    RoomTransferRow & { index: number; transferId: string }
  >[] = [
    {
      key: "index",
      label: "STT",
      render: (r) => <span style={CELL_STYLE}>{r.index + 1}</span>,
    },
    {
      key: "recordStatus",
      label: "Trạng thái",
      render: (r) => {
        const key = r.recordStatus as MedicalRecordStatus;
        const color = MedicalRecordStatusColor[key] ?? "gray";
        const label =
          MedicalRecordStatusMap[key] ?? String(r.recordStatus ?? "—");
        return (
          <div
            style={{
              ...CELL_STYLE,
              maxWidth: 320,
              whiteSpace: "normal",
              overflow: "visible",
            }}
            title={label}
          >
            <Badge
              variant="light"
              color={color}
              size="md"
              style={{
                display: "inline-block",
                whiteSpace: "normal",
                lineHeight: 1.3,
                height: "auto",
                wordBreak: "break-word",
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 10px",
              }}
            >
              {label}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "medicalRecordCode",
      label: "Mã HS",
      render: (r) => <span style={CELL_STYLE}>{r.medicalRecordCode}</span>,
    },
    {
      key: "patientName",
      label: "Họ tên",
      render: (r) => <span style={CELL_STYLE}>{r.patientName}</span>,
    },
    {
      key: "fromTo",
      label: "Từ phòng → Đến phòng",
      render: (r) => (
        <span style={CELL_STYLE}>
          {r.fromRoomNumber || "?"} → {r.toRoomNumber || "?"}
        </span>
      ),
    },
    {
      key: "transferTime",
      label: "Thời gian chuyển",
      render: (r) => (
        <span style={CELL_STYLE}>
          {r.transferTime
            ? dayjs(r.transferTime).format("DD/MM/YYYY HH:mm")
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <CustomTable<RoomTransferRow & { index: number; transferId: string }>
      data={data}
      columns={columns}
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      loading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={onRowClick}
      showActions={false}
      getRowStyle={(r) => ({
        backgroundColor:
          selectedId &&
          (selectedId === r.transferId || selectedId === r.medicalRecordId)
            ? "#cce5ff"
            : undefined,
        cursor: "pointer",
      })}
    />
  );
};

export default TranferPatientList;
