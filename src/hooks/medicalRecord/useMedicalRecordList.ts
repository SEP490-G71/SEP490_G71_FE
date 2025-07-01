import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalRecord } from "../../types/MedicalRecord/MedicalRecord";



export interface MedicalRecordFilter {
  fromDate?: string; // yyyy-MM-dd
  toDate?: string;
  page?: number;
  size?: number;
}

const useMedicalRecordList = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 50,
    totalElements: 0,
    totalPages: 1,
    last: true,
  });

  const fetchMedicalRecords = async (filters: MedicalRecordFilter = {}) => {
    try {
      setLoading(true);

      const params = {
        page: filters.page ?? 0,
        size: filters.size ?? 50,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      const res = await axiosInstance.get("/medical-record", { params });
      const result = res.data?.result;

      if (!Array.isArray(result?.content)) {
        setRecords([]);
        return;
      }

      setRecords(result.content);
      setPagination({
        pageNumber: result.pageNumber ?? 0,
        pageSize: result.pageSize ?? 50,
        totalElements: result.totalElements ?? 0,
        totalPages: result.totalPages ?? 1,
        last: result.last ?? true,
      });
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách hồ sơ bệnh án:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    records,
    loading,
    pagination,
    fetchMedicalRecords,
  };
};

export default useMedicalRecordList;
