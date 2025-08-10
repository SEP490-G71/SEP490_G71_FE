import axiosInstance from "../../../services/axiosInstance";

export const useExportMedicalServiceFeedbacksExcel = () => {
  const exportMedicalServiceFeedbacksExcel = async (params: Record<string, any> = {}) => {
    try {
      const response = await axiosInstance.get(
        "/medical-service-feedbacks/export",
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
      link.download = "medical-service-feedbacks.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ exportMedicalServiceFeedbacksExcel error:", error);
      alert("Không thể xuất đánh giá dịch vụ y tế ra Excel");
    }
  };

  return { exportMedicalServiceFeedbacksExcel };
};
