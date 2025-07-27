import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { InvoiceResponse } from "../../types/Invoice/invoice";

export interface UpdateInvoiceItemRequest {
  invoiceId: string;
  staffId: string;
  services: {
    serviceId: string;
    quantity: number;
  }[];
}

export const useUpdateInvoiceItems = () => {
  const [updating, setUpdating] = useState(false);
  const [updatedInvoice, setUpdatedInvoice] = useState<InvoiceResponse | null>(null);

  const updateInvoiceItems = async (payload: UpdateInvoiceItemRequest) => {
    try {
      setUpdating(true);

      const res = await axiosInstance.post("/invoices/update-items", payload);
      const result = res.data?.result;

      if (!result || res.data.code !== 1000) {
        throw new Error("Cập nhật thất bại hoặc dữ liệu không hợp lệ.");
      }

    const mapped: InvoiceResponse = {
  invoiceId: result.invoiceId,
  invoiceCode: result.invoiceCode ?? "---",
  status: result.status ?? "UNKNOWN",
  total: result.total ?? 0,
  amount: result.total ?? 0,
  discountTotal: result.discountTotal ?? null,
  originalTotal: result.originalTotal ?? null,
  vatTotal: result.vatTotal ?? null,
  paymentType: result.paymentType ?? null,
  patientName: result.patientName?.split(" - ")[0] ?? "---",
  patientCode: result.patientCode ?? "---", 
  confirmedBy: result.confirmedBy ?? "---",
  confirmedAt: result.confirmedAt ?? null,
  createdAt: result.createdAt ? new Date(result.createdAt).toISOString() : null,
  description: result.description ?? null,
};


      setUpdatedInvoice(mapped);
      return mapped;
    } catch (error: any) {
      console.error("❌ Lỗi cập nhật dịch vụ trong hóa đơn:", error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateInvoiceItems,
    updatedInvoice,
    updating,
  };
};
