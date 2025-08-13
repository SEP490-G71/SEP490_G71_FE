import { useEffect, useMemo, useState } from "react";
import { Paper, Select } from "@mantine/core";
import { Column } from "../../types/table";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";
import { GenderLabel } from "../../enums/Gender";
import {
  Status,
  StatusColor,
  StatusLabel,
} from "../../enums/Queue-Patient/Status";
import CustomTable from "../common/CustomTable";
import updatePatientStatus from "../../hooks/queue-patients/updatePatientStatus";
const NON_EDITABLE_STATUSES: Status[] = [
  Status.IN_PROGRESS,
  Status.AWAITING_RESULT,
  Status.DONE,
];
const isNonEditable = (s: Status) => NON_EDITABLE_STATUSES.includes(s);
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
  onStatusChanged?: (id: string, status: Status) => void;
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
  onStatusChanged,
}: Props) => {
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, Status>>(
    {}
  );
  const handleStatusChange = async (patientId: string, newStatus: Status) => {
    try {
      await updatePatientStatus(patientId, newStatus);
      setLocalStatuses((prev) => ({ ...prev, [patientId]: newStatus }));
      setEditingStatusId(null);
      onStatusChanged?.(patientId, newStatus);
    } catch {}
  };
  const getAllowedNextStatuses = (row: QueuePatient): Status[] => {
    const current = localStatuses[row.id] ?? row.status;

    switch (current) {
      case Status.WAITING:
        return [Status.CALLING];
      case Status.CALLING:
        return [Status.IN_PROGRESS, Status.CANCELED];
      case Status.IN_PROGRESS:
        return [];
      case Status.AWAITING_RESULT:
        return [];
      case Status.DONE:
        return [];
      case Status.CANCELED: {
        const hasWaiting = patients.some(
          (p) =>
            p.id !== row.id &&
            p.patientCode === row.patientCode &&
            (localStatuses[p.id] ?? p.status) === Status.WAITING
        );
        return hasWaiting ? [] : [Status.WAITING];
      }
      default:
        return [];
    }
  };

  const getStatusOptions = (row: QueuePatient) => {
    const allowed = getAllowedNextStatuses(row);
    const currentStatus = localStatuses[row.id] ?? row.status;

    const options = allowed.map((s) => ({
      value: s,
      label: StatusLabel[s],
    }));

    if (!allowed.includes(currentStatus)) {
      options.unshift({
        value: currentStatus,
        label: StatusLabel[currentStatus],
      });
    }

    return options;
  };

  useEffect(() => {
    const next: Record<string, Status> = {};
    patients.forEach((p) => {
      next[p.id] = p.status;
    });
    setLocalStatuses(next);
    if (editingStatusId && !patients.some((p) => p.id === editingStatusId)) {
      setEditingStatusId(null);
    }
  }, [patients]);
  const columns: Column<QueuePatient>[] = useMemo(
    () => [
      { key: "queueOrder", label: "STT" },
      {
        key: "status",
        label: "Trạng thái",
        render: (row) => {
          const currentStatus = localStatuses[row.id] ?? row.status;
          const color = StatusColor[currentStatus] ?? "gray";

          if (isNonEditable(currentStatus)) {
            return (
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full border bg-${color}-50 text-${color}-700 border-${color}-600`}
                title="Trạng thái này không thể chỉnh"
                style={{ cursor: "default" }}
              >
                {StatusLabel[currentStatus]}
              </span>
            );
          }

          if (editingStatusId === row.id) {
            return (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Select
                  size="xs"
                  data={getStatusOptions(row)}
                  value={currentStatus}
                  onChange={(value) => {
                    if (!value || value === currentStatus) {
                      setEditingStatusId(null);
                      return;
                    }
                    handleStatusChange(row.id, value as Status).finally(() => {
                      setEditingStatusId(null);
                    });
                  }}
                  clearable={false}
                  autoFocus
                />
              </div>
            );
          }

          return (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setEditingStatusId(row.id);
              }}
              className={`text-sm font-medium px-2 py-1 rounded-full border bg-${color}-50 text-${color}-700 border-${color}-600 cursor-pointer`}
              title="Click để chỉnh sửa"
            >
              {StatusLabel[currentStatus]}
            </span>
          );
        },
      },

      {
        key: "isPriority",
        label: "Ưu tiên",
        render: (row) => (
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                color: row.isPriority ? "green" : "gray",
                fontSize: "16px",
              }}
            >
              {row.isPriority ? "✔" : "✖"}
            </span>
          </div>
        ),
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
    [editingStatusId, localStatuses]
  );

  return (
    <Paper withBorder>
      <CustomTable<QueuePatient>
        data={patients}
        columns={columns}
        page={currentPage + 1}
        pageSize={pageSize}
        totalItems={totalElements}
        loading={loading}
        onPageChange={(p) => setCurrentPage(p - 1)}
        onPageSizeChange={setPageSize}
        onRowClick={editingStatusId ? () => {} : onSelectPatient}
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
