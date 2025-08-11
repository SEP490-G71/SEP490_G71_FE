import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalRecord } from "../../types/MedicalRecord/MedicalRecord";

export interface MedicalRecordRoomFilter {
  roomNumber: string | number;
  page?: number;
  size?: number;
  medicalRecordCode?: string;
  patientId?: string;
  patientCode?: string;
  patientName?: string;
  patientPhone?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

const useMedicalRecordByRoom = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 50,
    totalElements: 0,
    totalPages: 1,
    last: true,
  });

  const fetchMedicalRecordsByRoom = async (filters: MedicalRecordRoomFilter) => {
    if (!filters.roomNumber) {
      console.error("❌ Thiếu roomNumber để fetch hồ sơ bệnh án theo phòng");
      return;
    }

    try {
      setLoading(true);

      const {
        roomNumber,
        page = 0,
        size = 10,
        ...searchParams
      } = filters;

      const res = await axiosInstance.get(
        `/medical-records/room/${roomNumber}`,
        {
          params: {
            page,
            size,
            ...searchParams,
          },
        }
      );

      const result = res.data?.result;

      if (!Array.isArray(result?.content)) {
        setRecords([]);
        return;
      }

      setRecords(result.content);
      setPagination({
        pageNumber: result.pageNumber ?? 0,
        pageSize: result.pageSize ?? 10,
        totalElements: result.totalElements ?? 0,
        totalPages: result.totalPages ?? 1,
        last: result.last ?? true,
      });
    } catch (err) {
      console.error("❌ Lỗi khi lấy hồ sơ bệnh án theo phòng:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    records,
    loading,
    pagination,
    fetchMedicalRecordsByRoom,
  };
};

export default useMedicalRecordByRoom;
