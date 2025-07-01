import axiosInstance from "../../services/axiosInstance";


export const useExportInvoicesExcel = () => {
  const exportInvoicesExcel = async (params: Record<string, string>) => {
    try {
      const response = await axiosInstance.get("/invoice/export", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoices.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ exportInvoicesExcel error:", error);
      alert("Không thể xuất danh sách hóa đơn ra Excel");
    }
  };

  return { exportInvoicesExcel };
};
