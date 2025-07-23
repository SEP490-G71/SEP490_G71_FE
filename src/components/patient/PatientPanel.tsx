import { useMemo } from "react";
import { Divider, Paper, Title } from "@mantine/core";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";
import CustomTable from "../common/CustomTable";
import FilterPanel, { FilterField } from "../common/FilterSection";
import { Column } from "../../types/table";
import { Status, StatusLabel } from "../../enums/Queue-Patient/Status";
import { GenderLabel } from "../../enums/Gender";
import { DepartmentResponse } from "../../types/Admin/Department/DepartmentTypeResponse";
import { FloatingLabelWrapper } from "../common/FloatingLabelWrapper";

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
  department?: DepartmentResponse | null;
  updateFilters: (filters: any) => void;
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
  department,
  updateFilters,
}: PatientPanelProps) => {
  const today = new Date();

  const toDateString = (date: Date) =>
    date ? date.toISOString().split("T")[0] : undefined;

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
      { key: "patientCode", label: "Mã BN" },
      { key: "fullName", label: "Họ tên" },
      {
        key: "gender",
        label: "Giới tính",
        render: (row) =>
          GenderLabel[row.gender as keyof typeof GenderLabel] ?? "Không rõ",
      },
      { key: "phone", label: "Điện thoại" },
    ],
    [currentPage, pageSize]
  );

  const filterFields: FilterField[] = [
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: Object.entries(StatusLabel).map(([value, label]) => ({
        value,
        label,
      })),
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "name",
      label: "Tên bệnh nhân",
      type: "text",
      placeholder: "Nhập tên...",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "phone",
      label: "SĐT",
      type: "text",
      placeholder: "Nhập số điện thoại...",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "patientCode",
      label: "Mã BN",
      type: "text",
      placeholder: "Nhập mã bệnh nhân...",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "registeredTimeFrom",
      label: "Từ ngày",
      type: "date",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "registeredTimeTo",
      label: "Đến ngày",
      type: "date",
      wrapper: FloatingLabelWrapper,
    },
  ];

  const initialFilters = {
    name: "",
    phone: "",
    patientCode: "",
    status: "",
    registeredTimeFrom: today,
    registeredTimeTo: today,
  };

  const handleSearch = (filters: any) => {
    updateFilters({
      ...filters,
      roomNumber: department?.roomNumber,
    });
  };

  const handleReset = () => {
    updateFilters({
      name: "",
      phone: "",
      patientCode: "",
      status: "",
      registeredTimeFrom: toDateString(today),
      registeredTimeTo: toDateString(today),
      roomNumber: department?.roomNumber,
      type: department?.type,
    });
  };

  return (
    <Paper p="md" shadow="xs" withBorder radius={0}>
      <div className="flex flex-col">
        <FilterPanel
          fields={filterFields}
          initialValues={initialFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
        <Divider mt="md" mb={15} />
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
          onRowClick={(row) => onSelectPatient(row)}
        />
      </div>
    </Paper>
  );
};

export default PatientPanel;
