import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalRecord } from "../../types/Admin/Medical-Record/MedicalRecord";
import { toast } from "react-toastify";

const useMedicalRecord = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllMedicalRecords = async (
    page: number = 0,
    size: number = 5,
    sortDir: "asc" | "desc" = "asc",
    filters?: {
      medicalRecordCode?: string;
      patientName?: string;
      doctorName?: string;
      patientId?: string;
      createdById?: string;
      status?: string;
      fromDate?: string | null;
      toDate?: string | null;
    }
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/medical-record", {
        params: {
          page,
          size,
          sortDir,
          ...filters,
        },
      });
      setMedicalRecords(res.data.result.content);
      setTotalItems(res.data.result.totalElements);
    } catch (error) {
      console.error("Failed to fetch medical records", error);
      toast.error("Lỗi khi tải danh sách hồ sơ bệnh án");
    } finally {
      setLoading(false);
    }
  };

  return {
    medicalRecords,
    totalItems,
    loading,
    fetchAllMedicalRecords,
  };
};

export default useMedicalRecord;
