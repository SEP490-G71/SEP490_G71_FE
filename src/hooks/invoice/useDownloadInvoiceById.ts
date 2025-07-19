import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export const useDownloadInvoiceById = () => {
  const downloadInvoice = async (invoiceId: string) => {
    if (!invoiceId) {
      toast.error("Không có mã hóa đơn để tải");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/invoices/${invoiceId}/download`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);

      toast.success("Tải hóa đơn thành công!");
    } catch (error) {
      console.error("❌ downloadInvoice error:", error);
      toast.error("Không thể tải xuống hóa đơn");
    }
  };

  return { downloadInvoice };
};
