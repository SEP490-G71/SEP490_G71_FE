import axiosInstance from "../../../services/axiosInstance";

export const usePreviewInvoice = () => {
  const previewInvoice = async (invoiceId: string) => {
    if (!invoiceId) {
      alert("Không có mã hóa đơn để xem trước");
      return;
    }

    try {
      const response = await axiosInstance.get(`/invoice/${invoiceId}/preview`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("❌ previewInvoice error:", error);
      alert("Không thể xem trước hóa đơn");
    }
  };

  return { previewInvoice };
};
