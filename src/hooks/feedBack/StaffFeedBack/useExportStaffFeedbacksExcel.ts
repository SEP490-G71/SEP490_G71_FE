import axiosInstance from "../../../services/axiosInstance";

export const useExportStaffFeedbacksExcel = () => {
  const exportStaffFeedbacksExcel = async (params: Record<string, any> = {}) => {
    try {
      const response = await axiosInstance.get(
        "/staff-feedbacks/export",
        {
          params,
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "staff-feedbacks.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ exportStaffFeedbacksExcel error:", error);
      alert("Không thể xuất đánh giá nhân viên ra Excel");
    }
  };

  return { exportStaffFeedbacksExcel };
};
