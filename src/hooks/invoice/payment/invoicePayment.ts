import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { InvoiceDetail } from "../../../types/Invoice/invoice";

export interface MarkInvoicePendingRequest {
  invoiceId: string;
  staffId: string;
  paymentType: string;
}

export const markInvoicePending = async (
  invoiceDetail: InvoiceDetail,
  editableInvoiceDetail: {
    confirmedBy?: string;
    paymentType?: string;
  },
  fetchInvoiceDetail: (id: string) => Promise<void>
) => {
  if (!invoiceDetail || !editableInvoiceDetail.confirmedBy || !editableInvoiceDetail.paymentType) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  try {
    const payload: MarkInvoicePendingRequest = {
      invoiceId: invoiceDetail.invoiceId,
      staffId: editableInvoiceDetail.confirmedBy,
      paymentType: editableInvoiceDetail.paymentType,
    };

    await axiosInstance.post("/invoices/pay", payload);

    await fetchInvoiceDetail(invoiceDetail.invoiceId);
  } catch (error: any) {
    console.error("Lỗi khi thanh toán:", error);
    const message =
           error?.response?.data?.message ||
           error?.message ||
           "Không thể thanh toán.";
         toast.error(message);
  }
};
