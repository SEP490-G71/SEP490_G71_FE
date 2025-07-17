import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export const useExportBirthdayPatientsExcel = () => {
  const exportExcel = async (month?: number) => {
    try {
      const response = await axiosInstance.get(
        "/patients/birthdays-this-month/export",
        {
          params: month ? { month } : {},
          responseType: "blob", // để nhận file
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = month
        ? `birthday_patients_thang_${month}.xlsx`
        : "birthday_patients_all.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("🎉 Xuất file Excel thành công!");
    } catch (error) {
      toast.error("❗ Không thể xuất file Excel");
      console.error(error);
    }
  };

  return { exportExcel };
};
