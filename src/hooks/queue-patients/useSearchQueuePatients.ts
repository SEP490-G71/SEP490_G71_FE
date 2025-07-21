import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import {
  QueuePatient,
  SearchQueueParams,
} from "../../types/Queue-patient/QueuePatient";

const useQueuePatientService = (initialParams: Partial<SearchQueueParams> = {}) => {
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const [filters, setFilters] = useState<Partial<SearchQueueParams>>(initialParams);

  const fetchQueuePatients = async (
    customParams: Partial<SearchQueueParams> = {}
  ) => {
    setLoading(true);
    try {
      const finalParams: SearchQueueParams = {
        ...filters,
        ...customParams,
        page: customParams.page ?? currentPage,
        size: customParams.size ?? pageSize,
      };

      const res = await axiosInstance.get("/queue-patients/search", {
        params: finalParams,
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
    const timeout = setTimeout(() => {
      fetchQueuePatients();
    }, 300); // debounce tránh call liên tục
    return () => clearTimeout(timeout);
  }, [currentPage, pageSize, filters]); // thêm filters để theo dõi thay đổi

  return {
    patients,
    totalItems,
    loading,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    fetchQueuePatients,
    setFilters,
  };
};

export default useQueuePatientService;
