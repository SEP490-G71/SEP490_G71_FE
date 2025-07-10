import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { InvoiceDetail, InvoiceResponse } from "../../types/Invoice/invoice";

export interface InvoiceFilters {
  status?: string;
  staffId?: string;
  patientId?: string;
  invoiceCode?: string;
  fromDate?: string; 
  toDate?: string;
  
}

export const useFilteredInvoices = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: false,
  });

  const [invoiceStats, setInvoiceStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    monthlyRevenue: 0,
    validInvoices: 0,
  });

  const fetchInvoices = async (
    filters: InvoiceFilters = {},
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDir = "desc"
  ) => {
    try {
      setLoadingList(true);

      const params = {
        ...filters,
        page,
        size,
        sortBy,
        sortDir,
      };

      const res = await axiosInstance.get("/invoice", { params });
      const outerResult = res.data?.result;
      const result = outerResult?.data;

      if (!result || !Array.isArray(result.content)) {
        console.error("❌ Không có dữ liệu hợp lệ từ API /invoice");
        setInvoices([]);
        setPagination({
          pageNumber: 0,
          pageSize: size,
          totalElements: 0,
          totalPages: 0,
          last: true,
        });
        return;
      }

  const mappedInvoices: InvoiceResponse[] = result.content.map((item: any) => ({
  invoiceId: item.invoiceId,
  invoiceCode: item.invoiceCode ?? "---",
  status: item.status ?? "UNKNOWN",
  total: item.total ?? 0,                         
  amount: item.total ?? 0,                       
  discountTotal: item.discountTotal ?? null,
  originalTotal: item.originalTotal ?? null,
  vatTotal: item.vatTotal ?? null,
  paymentType: item.paymentType ?? null,
  patientName: item.patientName?.split(" - ")[0] ?? "---",
  confirmedBy: item.confirmedBy ?? "---",
  confirmedAt: item.confirmedAt ?? null,
  createdAt: item.createdAt ? new Date(item.createdAt) : null,
  description: item.description ?? null,
}));

      setInvoices(mappedInvoices);

      setPagination({
        pageNumber: result.pageNumber ?? 0,
        pageSize: result.pageSize ?? size,
        totalElements: result.totalElements ?? 0,
        totalPages: result.totalPages ?? 1,
        last: result.last ?? true,
      });

      setInvoiceStats({
        totalInvoices: outerResult?.totalInvoices ?? 0,
        totalAmount: outerResult?.totalAmount ?? 0,
        monthlyRevenue: outerResult?.monthlyRevenue ?? 0,
        validInvoices: outerResult?.validInvoices ?? 0,
      });
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
      setInvoiceDetail(res.data?.result ?? null);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết hóa đơn:", err);
      setInvoiceDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return {
    invoices,
    invoiceDetail,
    loadingList,
    loadingDetail,
    pagination,
    invoiceStats,
    fetchInvoices,
    fetchInvoiceDetail,
  };
};
