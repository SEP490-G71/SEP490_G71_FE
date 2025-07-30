import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalHistoryItem } from "../../types/Admin/Medical-Record/MedicalHistoryItem";


export const useMedicalHistoryByPatientId = (patientId?: string) => {
  const [history, setHistory] = useState<MedicalHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!patientId) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/medical-records/history/${patientId}`
        );
        setHistory(res.data.result || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Lỗi khi lấy lịch sử khám");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [patientId]);

  return { history, loading, error };
};
