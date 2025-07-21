import { useMemo } from "react";
import { Title } from "@mantine/core";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";
import CustomTable from "../common/CustomTable";
import FilterPanel from "../common/FilterSection";
import { Column } from "../../types/table";
import { Status, StatusLabel } from "../../enums/Queue-Patient/Status";
import { GenderLabel } from "../../enums/Gender";
import { DepartmentResponse } from "../../types/Admin/Department/DepartmentTypeResponse";

interface PatientPanelProps {
  selectedPatient: QueuePatient | null;
  onSelectPatient: (p: QueuePatient) => void;
  patients: QueuePatient[];
  totalElements: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: any) => void;
  department?: DepartmentResponse | null;
}

const PatientPanel = ({
  selectedPatient,
  onSelectPatient,
  patients,
  totalElements,
  pageSize,
  currentPage,
  loading,
  setPageSize,
  setCurrentPage,
  setFilters,
  department,
}: PatientPanelProps) => {
  const columns: Column<QueuePatient>[] = useMemo(
    () => [
      {
        key: "status",
        label: "Trạng thái",
        render: (row) => {
          const colorMap: Record<Status, string> = {
            [Status.ACTIVE]: "green",
            [Status.INACTIVE]: "gray",
            [Status.WAITING]: "orange",
            [Status.DONE]: "blue",
            [Status.CANCELED]: "red",
            [Status.IN_PROGRESS]: "indigo",
            [Status.PENDING]: "yellow",
            [Status.FAILED]: "red",
          };

          const status = row.status as Status;
          const color = colorMap[status];

          return (
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}
            >
              {StatusLabel[status]}
            </span>
          );
        },
      },
      {
        key: "patientCode",
        label: "Mã BN",
      },
      {
        key: "fullName",
        label: "Họ tên",
      },
      {
        key: "gender",
        label: "Giới tính",
        render: (row) =>
          GenderLabel[row.gender as keyof typeof GenderLabel] ?? "Không rõ",
      },
      {
        key: "phone",
        label: "Điện thoại",
      },
    ],
    [currentPage, pageSize]
  );

  const handleSearch = (filters: any) => {
    const enrichedFilters = {
      ...filters,
      roomNumber: department?.roomNumber,
      type: department?.type,
    };
    setFilters(enrichedFilters);
    setCurrentPage(0);
  };

  const handleReset = () => {
    const resetFilters = {
      roomNumber: department?.roomNumber,
      type: department?.type,
    };
    setFilters(resetFilters);
    setCurrentPage(0);
  };

  return (
    <div className="flex flex-col">
      <FilterPanel onSearch={handleSearch} onReset={handleReset} />
      <Title order={5} mb="md">
        Danh sách đăng ký
      </Title>

      <CustomTable<QueuePatient>
        data={patients}
        columns={columns}
        page={currentPage + 1}
        pageSize={pageSize}
        totalItems={totalElements}
        onPageChange={(p) => setCurrentPage(p - 1)}
        onPageSizeChange={setPageSize}
        loading={loading}
        showActions={false}
        getRowStyle={(row) => ({
          backgroundColor:
            selectedPatient?.patientCode === row.patientCode
              ? "#cce5ff"
              : undefined,
          cursor: "pointer",
        })}
        onView={onSelectPatient}
      />
    </div>
  );
};

export default PatientPanel;
