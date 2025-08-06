import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import useMedicalRecord from "../../../hooks/Medical-Record/useMedicalRecord";
import { createColumn } from "../../../components/utils/tableUtils";
import { MedicalRecord } from "../../../types/Admin/Medical-Record/MedicalRecord";
import { TextInput, Select, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { LuEye, LuDownload } from "react-icons/lu";
import usePatientSearch from "../../../hooks/Medical-Record/usePatientSearch";
import { format } from "date-fns";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

export const MedicalRecordPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { setting } = useSettingAdminService();

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

  const { options: patientOptions, searchPatients } = usePatientSearch();

  const formatLocalDateTime = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  const {
    medicalRecords,
    totalItems,
    loading,
    fetchAllMedicalRecords,
    handlePreview,
    handleDownload,
  } = useMedicalRecord();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchAllMedicalRecords(page - 1, pageSize);
  }, [page, pageSize, filters]);

  const handleSearch = () => {
    setFilters({
      medicalRecordCode: filterInput.medicalRecordCode.trim(),
      patientId: filterInput.patientId,
      createdById: filterInput.createdById,
      status: filterInput.status,
      fromDate: filterInput.fromDate
        ? formatLocalDateTime(filterInput.fromDate)
        : null,
      toDate: filterInput.toDate
        ? formatLocalDateTime(filterInput.toDate)
        : null,
    });
    setPage(1);
  };

  const handleReset = () => {
    setFilterInput({
      medicalRecordCode: "",
      patientId: "",
      createdById: "",
      status: "",
      fromDate: null,
      toDate: null,
    });
    setFilters({
      medicalRecordCode: "",
      patientId: "",
      createdById: "",
      status: "",
      fromDate: null,
      toDate: null,
    });
    searchPatients("");
    setPage(1);
  };

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
      render: (row) => format(new Date(row.createdAt), "dd/MM/yyyy"),
    }),
    createColumn<MedicalRecord>({
      key: "actions",
      label: "Thao tác",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="light"
            color="blue"
            onClick={() => handlePreview(row.id)}
            className="p-1 w-8 h-8 flex items-center justify-center"
          >
            <LuEye size={16} />
          </Button>

          <Button
            size="xs"
            variant="light"
            color="green"
            onClick={() => handleDownload(row.id)}
            className="p-1 w-8 h-8 flex items-center justify-center"
          >
            <LuDownload size={16} />
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Hồ sơ bệnh án</h1>
      </div>
      <div className="grid grid-cols-12 gap-4 my-4">
        {/* Mã hồ sơ - 2/12 */}
        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Mã hồ sơ">
            <TextInput
              placeholder="Mã hồ sơ"
              value={filterInput.medicalRecordCode}
              onChange={(e) =>
                setFilterInput({
                  ...filterInput,
                  medicalRecordCode: e.currentTarget.value,
                })
              }
            />
          </FloatingLabelWrapper>
        </div>

        {/* Tên bệnh nhân - 3/12 */}
        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Tìm tên bệnh nhân">
            <Select
              searchable
              placeholder="Tìm tên bệnh nhân"
              data={patientOptions}
              onSearchChange={(query) => searchPatients(query)}
              onChange={(value) =>
                setFilterInput({ ...filterInput, patientId: value || "" })
              }
              value={filterInput.patientId || null}
              clearable
            />
          </FloatingLabelWrapper>
        </div>

        {/* Trạng thái - 2/12 */}
        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Trạng thái">
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
              onChange={(value) =>
                setFilterInput({ ...filterInput, status: value || "" })
              }
              clearable
            />
          </FloatingLabelWrapper>
        </div>

        {/* Từ ngày - 2/12 */}
        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Từ ngày">
            <DatePickerInput
              placeholder="Từ ngày"
              value={filterInput.fromDate}
              valueFormat="DD/MM/YYYY"
              maxDate={new Date()}
              onChange={(value) => {
                const date = value ? new Date(value) : null;
                if (date) date.setHours(0, 0, 0, 0);
                setFilterInput((prev) => ({ ...prev, fromDate: date }));
              }}
            />
          </FloatingLabelWrapper>
        </div>

        {/* Đến ngày - 2/12 */}
        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Đến ngày">
            <DatePickerInput
              placeholder="Đến ngày"
              value={filterInput.toDate}
              valueFormat="DD/MM/YYYY"
              onChange={(value) => {
                const date = value ? new Date(value) : null;
                if (date) date.setHours(23, 59, 59, 999);
                setFilterInput((prev) => ({ ...prev, toDate: date }));
              }}
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút hành động - 1/12 */}
        <div className="col-span-12 md:col-span-2 flex items-end gap-2">
          <Button variant="light" color="gray" onClick={handleReset} fullWidth>
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            fullWidth
          >
            Tìm kiếm
          </Button>
        </div>
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
        loading={loading}
        showActions={false}
      />
    </div>
  );
};

export default MedicalRecordPage;
