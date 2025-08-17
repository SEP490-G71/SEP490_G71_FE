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
  if (!invoiceDetail) {
    const err: any = new Error("MISSING_INVOICE_DETAIL");
    err.code = "MISSING_INVOICE_DETAIL";
    throw err;
  }
  if (!editableInvoiceDetail.confirmedBy || !editableInvoiceDetail.paymentType) {
    const err: any = new Error("MISSING_REQUIRED_FIELDS");
    err.code = "MISSING_REQUIRED_FIELDS";
    throw err;
  }

  const payload: MarkInvoicePendingRequest = {
    invoiceId: invoiceDetail.invoiceId,
    staffId: editableInvoiceDetail.confirmedBy,
    paymentType: editableInvoiceDetail.paymentType,
  };

  try {
    const res = await axiosInstance.post("/invoices/pay", payload);

    // Nếu backend trả body có code khác 1000 thì coi là lỗi
    const code = res?.data?.code;
    if (typeof code === "number" && code !== 1000) {
      const err: any = new Error(res?.data?.message || "PAY_FAILED");
      err.response = { status: 400, data: res?.data };
      err.code = res?.data?.code;
      throw err;
    }

    await fetchInvoiceDetail(invoiceDetail.invoiceId);
    return res.data;
  } catch (error) {
    // ❗️Không toast ở đây — ném lên cho hàm cha xử lý (hiển thị đúng 1 toast)
    throw error;
  }
};
