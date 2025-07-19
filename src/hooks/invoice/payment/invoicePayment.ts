// src/hooks/invoice/payment/invoicePaymentApi.ts

import axiosInstance from "../../../services/axiosInstance";
import { InvoiceDetail } from "../../../types/Invoice/invoice";

export interface MarkInvoicePendingRequest {
  invoiceId: string;
  staffId: string;
  paymentType: string;
}

// Gọi API để chuyển trạng thái hóa đơn sang "PENDING"
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

    // ✅ Dùng đúng đường dẫn API thật bạn đã confirm
    await axiosInstance.post("/invoices/pay", payload);

    await fetchInvoiceDetail(invoiceDetail.invoiceId);
  } catch (error: any) {
    console.error("❌ markInvoicePending error:", error);
    throw error;
  }
};
