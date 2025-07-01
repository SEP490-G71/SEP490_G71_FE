import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import useMedicalRecord from "../../../hooks/Medical-Record/useMedicalRecord";
import { createColumn } from "../../../components/utils/tableUtils";
import { MedicalRecord } from "../../../types/Admin/Medical-Record/MedicalRecord";
import { Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

export const MedicalRecordPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [filterInput, setFilterInput] = useState<{
    medicalRecordCode: string;
    patientId: string;
    createdById: string;
    status?: string;
    fromDate: Date | null;
    toDate: Date | null;
  }>({
    medicalRecordCode: "",
    patientId: "",
    createdById: "",
    status: "",
    fromDate: null,
    toDate: null,
  });

  const [filters, setFilters] = useState<{
    medicalRecordCode: string;
    patientId: string;
    createdById: string;
    status?: string;
    fromDate: string | null;
    toDate: string | null;
  }>({
    medicalRecordCode: "",
    patientId: "",
    createdById: "",
    status: "",
    fromDate: null,
    toDate: null,
  });

  const formatLocalDateTime = (date: Date): string =>
    date
      .toLocaleString("sv-SE", {
        hour12: false,
      })
      .replace(" ", "T");

  const { medicalRecords, totalItems, loading, fetchAllMedicalRecords } =
    useMedicalRecord();

  useEffect(() => {
    fetchAllMedicalRecords(page - 1, pageSize, sortDir, filters);
  }, [page, pageSize, sortDir, filters]);

  const columns = [
    createColumn<MedicalRecord>({
      key: "medicalRecordCode",
      label: "Mã hồ sơ",
    }),
    createColumn<MedicalRecord>({
      key: "patientName",
      label: "Tên bệnh nhân",
    }),
    createColumn<MedicalRecord>({
      key: "doctorName",
      label: "Bác sĩ phụ trách",
    }),
    createColumn<MedicalRecord>({
      key: "status",
      label: "Trạng thái",
      render: (row) => {
        const statusMap: Record<string, string> = {
          TESTING: "Đang xét nghiệm",
          WAITING_FOR_PAYMENT: "Chờ thanh toán",
          TESTING_COMPLETED: "Đã xét nghiệm",
          DONE: "Hoàn tất",
          CANCELLED: "Đã huỷ",
        };
        return statusMap[row.status] || row.status;
      },
    }),

    createColumn<MedicalRecord>({
      key: "createdAt",
      label: "Ngày tạo",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    }),
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Hồ sơ bệnh án</h1>
      </div>

      <div className="flex flex-wrap gap-2 my-4">
        <TextInput
          placeholder="Mã hồ sơ"
          value={filterInput.medicalRecordCode}
          onChange={(e) =>
            setFilterInput({
              ...filterInput,
              medicalRecordCode: e.currentTarget.value,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilters((prev) => ({
                ...prev,
                medicalRecordCode: filterInput.medicalRecordCode.trim(),
              }));
              setPage(1);
            }
          }}
          className="flex-1 min-w-[200px]"
        />

        <Select
          data={[
            { value: "", label: "Tất cả trạng thái" },
            { value: "TESTING", label: "Đang xét nghiệm" },
            { value: "WAITING_FOR_PAYMENT", label: "Chờ thanh toán" },
            { value: "TESTING_COMPLETED", label: "Đã xét nghiệm" },
            { value: "WAITING_FOR_RESULT", label: "Chờ kết quả" },
            { value: "RESULT_COMPLETED", label: "Hoàn thành kết quả" },
          ]}
          placeholder="Trạng thái"
          value={filterInput.status}
          onChange={(value) => {
            setFilterInput({ ...filterInput, status: value || "" });
            setFilters((prev) => {
              const newFilters = { ...prev };
              if (!value) delete newFilters.status;
              else newFilters.status = value;
              return newFilters;
            });
            setPage(1);
          }}
          className="flex-1 min-w-[200px]"
        />

        <DatePickerInput
          placeholder="Từ ngày"
          value={filterInput.fromDate}
          valueFormat="DD/MM/YYYY"
          onChange={(value) => {
            const date = value ? new Date(value) : null;
            if (date) date.setHours(0, 0, 0, 0);

            setFilterInput((prev) => ({ ...prev, fromDate: date }));
            setFilters((prev) => ({
              ...prev,
              fromDate: date ? formatLocalDateTime(date) : null,
            }));
            setPage(1);
          }}
        />

        <DatePickerInput
          placeholder="Đến ngày"
          value={filterInput.toDate}
          valueFormat="DD/MM/YYYY"
          onChange={(value) => {
            const date = value ? new Date(value) : null;
            if (date) date.setHours(23, 59, 59, 999);

            setFilterInput((prev) => ({ ...prev, toDate: date }));
            setFilters((prev) => ({
              ...prev,
              toDate: date ? formatLocalDateTime(date) : null,
            }));
            setPage(1);
          }}
        />
      </div>

      <CustomTable
        data={medicalRecords}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        sortDirection={sortDir}
        onSortChange={(_, dir) => setSortDir(dir)}
        loading={loading}
        showActions={false}
      />
    </div>
  );
};
export default MedicalRecordPage;
