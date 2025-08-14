import {
  MedicalRecordStatusColor,
  MedicalRecordStatusMap,
} from "../../enums/MedicalRecord/MedicalRecordStatus";
import { MedicalRecord } from "../../types/MedicalRecord/MedicalRecord";
import CustomTable from "../common/CustomTable";
import { Column } from "../../types/table";
import dayjs from "dayjs";
import { Badge } from "@mantine/core";

interface ClinicListProps {
  records: MedicalRecord[];
  loading: boolean;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string) => void;
  onSelectRecordAndPatient?: (record: MedicalRecord) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pagination: {
    totalElements: number;
    totalPages: number;
  };
}

const ClinicList = ({
  records,
  loading,
  selectedRecordId,
  setSelectedRecordId,
  onSelectRecordAndPatient,
  page,
  setPage,
  pageSize,
  setPageSize,
  pagination,
}: ClinicListProps) => {
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
    {
      key: "medicalRecordCode",
      label: "Mã hồ sơ",
    },
    {
      key: "patientName",
      label: "Tên bệnh nhân",
    },
    {
      key: "doctorName",
      label: "Người kê đơn",
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (row) => dayjs(row.createdAt).format("DD/MM/YYYY"),
    },
  ];

  return (
    <>
      <CustomTable<MedicalRecord>
        data={records}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={pagination.totalElements}
        loading={loading}
        showActions={false}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowClick={(row) => {
          setSelectedRecordId(row.id);
          onSelectRecordAndPatient?.(row);
        }}
        getRowStyle={(row) =>
          row.id === selectedRecordId ? { backgroundColor: "#cce5ff" } : {}
        }
      />
    </>
  );
};

export default ClinicList;
