import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

export const useInvoiceStatistics = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    monthlyRevenue: 0,
    validInvoices: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchInvoiceStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/invoice");
      const result = res.data?.result;
      setStats({
        totalInvoices: result?.totalInvoices ?? 0,
        totalAmount: result?.totalAmount ?? 0,
        monthlyRevenue: result?.monthlyRevenue ?? 0,
        validInvoices: result?.validInvoices ?? 0,
      });
    } catch (err) {
      console.error("❌ Lỗi khi lấy thống kê hoá đơn:", err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, fetchInvoiceStats };
};
