import dayjs from "dayjs";
import CustomTable from "../common/CustomTable";
import { Column } from "../../types/table";
import { RoomTransferRow } from "../../types/RoomTranfer/RoomTransfer";

type Props = {
  rows: RoomTransferRow[];
  page: number;
  pageSize: number;
  totalItems: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  selectedId?: string | null; // để highlight từ ngoài truyền vào
  onRowClick?: (row: RoomTransferRow & { index: number }) => void;
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
  const data = rows.map((r, idx) => ({
    ...r,
    index: (page - 1) * pageSize + idx,
    id: r.medicalRecordId,
  }));

  const columns: Column<RoomTransferRow & { index: number }>[] = [
    { key: "index", label: "STT", render: (r) => r.index + 1 },
    { key: "recordStatus", label: "Trạng thái" },
    { key: "medicalRecordCode", label: "Mã HS" },
    { key: "patientName", label: "Họ tên" },
    {
      key: "fromTo",
      label: "Từ phòng → Đến phòng",
      render: (r) => `${r.fromRoomNumber || "?"} → ${r.toRoomNumber || "?"}`,
    },
    {
      key: "transferTime",
      label: "Thời gian chuyển",
      render: (r) =>
        r.transferTime ? dayjs(r.transferTime).format("DD/MM/YYYY HH:mm") : "—",
    },
    { key: "reason", label: "Lý do", render: (r) => r.reason || "—" },
  ];

  return (
    <CustomTable<RoomTransferRow & { index: number }>
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
      // 🔹 Highlight dựa theo selectedId truyền vào
      getRowStyle={(r) => ({
        backgroundColor:
          selectedId && selectedId === r.medicalRecordId
            ? "#cce5ff"
            : undefined,
        cursor: "pointer",
      })}
    />
  );
};

export default TranferPatientList;
