
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import {
  QueuePatient,
  SearchQueueParams,
} from "../../types/Queue-patient/QueuePatient";

const useQueuePatientService = (initialFilters: Partial<SearchQueueParams> = {}) => {
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [queryParams, setQueryParams] = useState({
    filters: initialFilters,
    page: 0,
    size: 10,
  });

  const fetchQueuePatients = async (params = queryParams) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/queue-patients/search", {
        params: {
          ...params.filters,
          page: params.page,
          size: params.size,
        },
      });

      const data = res.data.result;
      setPatients(data.content ?? []);
      setTotalItems(data.totalElements ?? 0);

      if (!data.content || data.content.length === 0) {
        toast.info("Không có bệnh nhân nào phù hợp.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
      toast.error("Không thể tải danh sách bệnh nhân.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!queryParams.filters?.roomNumber) return;

    const timeout = setTimeout(() => {
      fetchQueuePatients();
    }, 300);

    return () => clearTimeout(timeout);
  }, [queryParams]);


  const updateFilters = (newFilters: Partial<SearchQueueParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      filters: newFilters,
      page: 0,
    }));
  };

  const setCurrentPage = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const setPageSize = (size: number) => {
    setQueryParams((prev) => ({ ...prev, size }));
  };

  return {
    patients,
    totalItems,
    loading,
    currentPage: queryParams.page,
    pageSize: queryParams.size,
    setCurrentPage,
    setPageSize,
    updateFilters,
  };
};

export default useQueuePatientService;
