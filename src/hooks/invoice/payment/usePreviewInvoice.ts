import axiosInstance from "../../../services/axiosInstance";

export const usePreviewInvoice = () => {
  const previewInvoice = async (invoiceId: string): Promise<string | null> => {
    if (!invoiceId) {
      alert("Không có mã hóa đơn để xem trước");
      return null;
    }

    try {
      const response = await axiosInstance.get(`/invoices/${invoiceId}/preview`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("❌ previewInvoice error:", error);
      alert("Không thể xem trước hóa đơn");
      return null;
    }
  };

  return { previewInvoice };
};
