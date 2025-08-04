import { useMemo } from "react";
import { Paper } from "@mantine/core";
import { Column } from "../../types/table";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";
import { GenderLabel } from "../../enums/Gender";
import {
  Status,
  StatusColor,
  StatusLabel,
} from "../../enums/Queue-Patient/Status";
import CustomTable from "../common/CustomTable";

interface Props {
  patients: QueuePatient[];
  selectedPatient: QueuePatient | null;
  onSelectPatient: (p: QueuePatient) => void;
  pageSize: number;
  currentPage: number;
  totalElements: number;
  loading: boolean;
  setCurrentPage: (p: number) => void;
  setPageSize: (s: number) => void;
}

const WaitingPatientList = ({
  patients,
  selectedPatient,
  onSelectPatient,
  pageSize,
  currentPage,
  totalElements,
  loading,
  setCurrentPage,
  setPageSize,
}: Props) => {
  const filteredPatients = useMemo(
    () =>
      patients.filter(
        (p) =>
          p.status !== Status.CANCELED &&
          p.status !== Status.DONE &&
          p.status !== Status.AWAITING_RESULT
      ),
    [patients]
  );

  const columns: Column<QueuePatient>[] = useMemo(
    () => [
      { key: "queueOrder", label: "STT" },
      {
        key: "status",
        label: "Trạng thái",
        render: (row) => {
          const color = StatusColor[row.status] ?? "gray";
          return (
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}
            >
              {StatusLabel[row.status]}
            </span>
          );
        },
      },
      { key: "patientCode", label: "Mã BN" },
      { key: "fullName", label: "Họ tên" },
      {
        key: "registeredTime",
        label: "Ngày đăng kí",
        render: (row) =>
          row.registeredTime
            ? new Date(row.registeredTime).toLocaleDateString("vi-VN")
            : "Không rõ",
      },
      {
        key: "gender",
        label: "Giới tính",
        render: (row) => GenderLabel[row.gender],
      },
      { key: "phone", label: "SĐT" },
    ],
    [currentPage, pageSize]
  );

  return (
    <Paper withBorder>
      <CustomTable<QueuePatient>
        data={filteredPatients}
        columns={columns}
        page={currentPage + 1}
        pageSize={pageSize}
        totalItems={totalElements}
        loading={loading}
        onPageChange={(p) => setCurrentPage(p - 1)}
        onPageSizeChange={setPageSize}
        onRowClick={onSelectPatient}
        getRowStyle={(row) => ({
          backgroundColor:
            selectedPatient?.id === row.id ? "#cce5ff" : undefined,
          cursor: "pointer",
        })}
        showActions={false}
      />
    </Paper>
  );
};

export default WaitingPatientList;
