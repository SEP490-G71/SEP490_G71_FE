import { Badge, Paper } from "@mantine/core";
import { Column } from "../../types/table";
import { MedicalRecord } from "../../types/MedicalRecord/MedicalRecord";
import CustomTable from "../common/CustomTable";
import { MedicalRecordRoomFilter } from "../../hooks/medicalRecord/useMedicalRecordByRoom";
import {
  MedicalRecordStatusColor,
  MedicalRecordStatusMap,
} from "../../enums/MedicalRecord/MedicalRecordStatus";

interface Props {
  records: MedicalRecord[];
  loading: boolean;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
  };
  fetchMedicalRecords: (filters: MedicalRecordRoomFilter) => void;
  selectedId: string | null;
  onSelect: (record: MedicalRecord) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  roomNumber: string | number;
}

const InProgressPatientList = ({
  records,
  loading,
  pagination,
  selectedId,
  onSelect,
  setCurrentPage,
  setPageSize,
}: Props) => {
  const columns: Column<MedicalRecord>[] = [
    {
      key: "status",
      label: "Trạng thái",
      render: (r) => (
        <Badge color={MedicalRecordStatusColor[r.status]} variant="light">
          {MedicalRecordStatusMap[r.status] ?? r.status}
        </Badge>
      ),
    },
    { key: "medicalRecordCode", label: "Mã bệnh án" },
    { key: "patientName", label: "Họ tên" },
    {
      key: "startedAt",
      label: "Bắt đầu khám",
      render: (r) =>
        r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("vi-VN")
          : "Chưa có",
    },
  ];

  return (
    <Paper withBorder>
      <CustomTable<MedicalRecord>
        data={records}
        columns={columns}
        page={pagination.pageNumber + 1}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalElements}
        loading={loading}
        onPageChange={(p) => setCurrentPage(p - 1)}
        onPageSizeChange={setPageSize}
        onRowClick={onSelect}
        getRowStyle={(r) => ({
          backgroundColor: selectedId === r.id ? "#cce5ff" : undefined,
          cursor: "pointer",
        })}
        showActions={false}
      />
    </Paper>
  );
};

export default InProgressPatientList;
