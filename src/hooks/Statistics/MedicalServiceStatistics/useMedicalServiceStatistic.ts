import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";

interface MedicalServiceStatisticItem {
  serviceCode: string;
  name: string;
  price: number;
  totalUsage: number;
  totalOriginal: number;
  totalDiscount: number;
  totalVat: number;
  totalRevenue: number;
}

type MostUsedService = MedicalServiceStatisticItem;

interface MedicalServiceStatisticSummary {
  totalServiceTypes: number;
  totalUsage: number;
  totalRevenue: number;
  mostUsedService: MostUsedService | null;
}

interface StatisticFilters {
  fromDate?: string;
  toDate?: string;
  serviceCode?: string;
  name?: string;
}

export const useMedicalServiceStatistic = () => {
  const [statistics, setStatistics] = useState<MedicalServiceStatisticItem[]>([]);
  const [summary, setSummary] = useState<MedicalServiceStatisticSummary>({
    totalServiceTypes: 0,
    totalUsage: 0,
    totalRevenue: 0,
    mostUsedService: null,
  });
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

 const fetchStatistics = async (
  page: number = 0,
  size: number = 10,
  filters: StatisticFilters = {}
) => {
  setLoading(true);
  try {
    const res = await axiosInstance.get("/invoice-items/statistics", {
      params: {
        page,
        size,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        serviceCode: filters.serviceCode,
        name: filters.name,
      },
    });

    const result = res.data.result;
    setStatistics(result.details.content);
    setTotalItems(result.details.totalElements);

    setSummary({
      totalServiceTypes: result.totalServiceTypes,
      totalUsage: result.totalUsage,
      totalRevenue: result.totalRevenue,
      mostUsedService: result.mostUsedService ?? null,
    });
  } catch (error) {
    console.error("Failed to fetch medical service statistics:", error);
    toast.error("Không thể tải dữ liệu thống kê dịch vụ");
  } finally {
    setLoading(false);
  }
};


 const exportStatistics = async (filters: StatisticFilters = {}) => {
  try {
    const res = await axiosInstance.get("/invoice-items/export", {
      params: {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        serviceCode: filters.serviceCode,
        name: filters.name,
      },
      responseType: "blob",
    });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "medical_service_statistics.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Xuất Excel thành công");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Xuất Excel thất bại");
  }
};


  return {
    statistics,
    setStatistics,
    summary,
    totalItems,
    loading,
    setLoading,
    fetchStatistics,
    exportStatistics,
  };
};

export default useMedicalServiceStatistic;
