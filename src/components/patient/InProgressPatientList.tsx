import { Paper } from "@mantine/core";
import { useEffect } from "react";
import { Column } from "../../types/table";
import { MedicalRecord } from "../../types/MedicalRecord/MedicalRecord";
import CustomTable from "../common/CustomTable";
import { MedicalRecordRoomFilter } from "../../hooks/medicalRecord/useMedicalRecordByRoom";
import {
  MedicalRecordStatus,
  MedicalRecordStatusMap,
} from "../../enums/MedicalRecord/MedicalRecordStatus";
import dayjs from "dayjs";

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
  fetchMedicalRecords,
  selectedId,
  onSelect,
  setCurrentPage,
  setPageSize,
  roomNumber,
}: Props) => {
  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");

    if (!roomNumber) return;

    fetchMedicalRecords({
      roomNumber,
      page: pagination.pageNumber,
      size: pagination.pageSize,
      status: `${MedicalRecordStatus.TESTING},${MedicalRecordStatus.WAITING_FOR_RESULT}`,
      fromDate: today,
      toDate: today,
    });
  }, [pagination.pageNumber, pagination.pageSize, roomNumber]);

  const columns: Column<MedicalRecord>[] = [
    {
      key: "status",
      label: "Trạng thái",
      render: (r) => MedicalRecordStatusMap[r.status] ?? r.status,
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
