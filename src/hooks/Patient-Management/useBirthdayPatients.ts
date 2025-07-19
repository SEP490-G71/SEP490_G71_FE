import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { useState } from "react";
import { Patient } from "../../types/Patient/Patient";

export const useBirthdayPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPatients = async (page: number, size: number) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/patients", {
        params: { page, size },
      });
      const result = res.data.result;
      setPatients(result.content || []);
      setTotalItems(result.totalElements || 0);
    } catch (error) {
      toast.error("Không thể tải danh sách bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  const fetchBirthdayPatientsByMonth = async (
    month: number,
    page: number,
    size: number
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/patients/birthdays", {
        params: { month, page, size },
      });
      const result = res.data.result;
      setPatients(result.content || []);
      setTotalItems(result.totalElements || 0);
    } catch (error) {
      toast.error("Không thể tải danh sách sinh nhật tháng " + month);
    } finally {
      setLoading(false);
    }
  };

  return {
    patients,
    totalItems,
    loading,
    fetchPatients,
    fetchBirthdayPatientsByMonth,
  };
};
