import { useEffect, useState } from "react";
import { Button, Select } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { useBirthdayPatients } from "../../../hooks/Patient-Management/useBirthdayPatients";
import { Patient } from "../../../types/Patient/Patient";
import { LuDownload } from "react-icons/lu";
import { useExportBirthdayPatientsExcel } from "../../../hooks/Patient-Management/useExportBirthdayPatientsExcel";
import { useSendBirthdayEmail } from "../../../hooks/Patient-Management/useSendBirthdayEmail";
import { toast } from "react-toastify";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `Tháng ${i + 1}`,
}));

const PatientStatisticsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { exportExcel } = useExportBirthdayPatientsExcel();
  const { setting } = useSettingAdminService();
  const { sendBirthdayEmail } = useSendBirthdayEmail();
  const {
    patients,
    totalItems,
    loading,
    fetchPatients,
    fetchBirthdayPatientsByMonth,
  } = useBirthdayPatients();
  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);
  useEffect(() => {
    if (selectedMonth) {
      fetchBirthdayPatientsByMonth(Number(selectedMonth), page - 1, pageSize);
    } else {
      fetchPatients(page - 1, pageSize);
    }
  }, [selectedMonth, page, pageSize]);

  const handleExportExcel = () => {
    exportExcel(selectedMonth ? Number(selectedMonth) : undefined);
  };

  const handleSendMail = () => {
    const currentMonth = new Date().getMonth() + 1;

    if (loading) return;

    sendBirthdayEmail(currentMonth);
    toast.success(
      `Đã gửi email sinh nhật cho bệnh nhân sinh vào tháng ${currentMonth}`
    );
  };

  const columns = [
    createColumn<Patient>({ key: "patientCode", label: "Mã bệnh nhân" }),
    createColumn<Patient>({ key: "fullName", label: "Họ tên" }),
    createColumn<Patient>({
      key: "dob",
      label: "Ngày sinh",
      render: (row) =>
        row.dob ? new Date(row.dob).toLocaleDateString("vi-VN") : "---",
    }),
    createColumn<Patient>({
      key: "gender",
      label: "Giới tính",
      render: (row) =>
        row.gender === "MALE" ? "Nam" : row.gender === "FEMALE" ? "Nữ" : "---",
    }),
    createColumn<Patient>({ key: "email", label: "Email" }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Sinh nhật khách hàng trong tháng</h1>
        <Button
          leftSection={<LuDownload size={16} />}
          onClick={handleExportExcel}
          variant="filled"
          color="blue"
        >
          Xuất Excel
        </Button>
      </div>

      <div className="flex items-end gap-2 mb-4 w-full">
        {/* Chọn tháng */}
        <div className="flex-grow">
          <FloatingLabelWrapper label="Chọn tháng">
            <Select
              placeholder="Chọn tháng"
              value={selectedMonth}
              onChange={(value) => {
                setSelectedMonth(value);
                setPage(1);
              }}
              data={monthOptions}
              clearable
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Gửi email chúc mừng sinh nhật button */}
        <div className="ml-2">
          <Button color="teal" onClick={handleSendMail}>
            Gửi email sinh nhật
          </Button>
        </div>
      </div>

      <CustomTable
        data={patients}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        loading={loading}
        showActions={false}
      />
    </>
  );
};

export default PatientStatisticsPage;
