import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { InvoiceDetail, InvoiceSummary } from "../../types/Invoice/invoice";

export interface InvoiceItemUpdate {
  serviceId: string;
  quantity: number;
}

export interface UpdateInvoiceRequest {
  invoiceId: string;
  staffId: string;
  services: InvoiceItemUpdate[];
}

export const useInvoice = () => {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updating, setUpdating] = useState(false);
const [pagination, setPagination] = useState({
  pageNumber: 0,
  pageSize: 5,
  totalElements: 0,
  totalPages: 0,
  last: false,
});
const fetchInvoices = async (page = 0, size = 5) => {
  try {
    setLoadingList(true);
    const res = await axiosInstance.get(`/invoice?page=${page}&size=${size}&sortDir=asc`);
    const result = res.data?.result;

    const list = result?.content;
    setInvoices(Array.isArray(list) ? list : []);

    if (result) {
      setPagination({
        pageNumber: result.pageNumber,
        pageSize: result.pageSize,
        totalElements: result.totalElements,
        totalPages: result.totalPages,
        last: result.last,
      });
    }
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách hóa đơn:", err);
  } finally {
    setLoadingList(false);
  }
};


  const fetchInvoiceDetail = async (invoiceId: string) => {
    try {
      setLoadingDetail(true);
      const res = await axiosInstance.get(`/invoice/${invoiceId}`);
         const detail = res.data?.result || null;
    console.log("🧾 Chi tiết hóa đơn:", detail);
      setInvoiceDetail(res.data?.result || null);
     
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết hóa đơn:", err);
      setInvoiceDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const updateInvoice = async (payload: UpdateInvoiceRequest) => {
    try {
      setUpdating(true);
      const res = await axiosInstance.put("/invoice", payload);
      await fetchInvoiceDetail(payload.invoiceId);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hóa đơn:", error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return {
    invoices,
    invoiceDetail,
    loadingList,
    loadingDetail,
    updating,
    fetchInvoices,
    fetchInvoiceDetail,
    pagination,
    updateInvoice,
  };
};
