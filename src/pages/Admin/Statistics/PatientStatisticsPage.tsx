import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { useBirthdayPatients } from "../../../hooks/Patient-Management/useBirthdayPatients";
import { Patient } from "../../../types/Patient/Patient";
import { useExportBirthdayPatientsExcel } from "../../../hooks/Patient-Management/useExportBirthdayPatientsExcel";
import { useSendBirthdayEmail } from "../../../hooks/Patient-Management/useSendBirthdayEmail";
import { toast } from "react-toastify";

const PatientStatisticsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { exportExcel } = useExportBirthdayPatientsExcel();
  const { setting } = useSettingAdminService();
  const { sendBirthdayEmail } = useSendBirthdayEmail();
  const { patients, totalItems, loading, fetchBirthdayPatientsByMonth } =
    useBirthdayPatients();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    fetchBirthdayPatientsByMonth(currentMonth, page - 1, pageSize);
  }, [page, pageSize]);

  const handleExportExcel = () => {
    const currentMonth = new Date().getMonth() + 1;
    exportExcel(currentMonth);
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
        <h1 className="text-xl font-bold">
          Sinh nhật khách hàng trong tháng {new Date().getMonth() + 1}
        </h1>
        <Button
          leftSection={
            <img
              src="/images/icons8-excel-48.png"
              alt="Excel"
              className="w-6 h-6 object-contain"
            />
          }
          onClick={handleExportExcel}
          variant="default"
          style={{
            backgroundColor: "#bbf7d0",
            color: "#15803d",
            border: "1px solid #15803d",
            fontWeight: 600,
          }}
        >
          Xuất Excel
        </Button>
      </div>

      <div className="flex justify-end mb-4 w-full">
        <Button color="teal" onClick={handleSendMail}>
          Gửi email sinh nhật
        </Button>
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
