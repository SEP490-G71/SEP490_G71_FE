import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

export interface DefaultMedicalService {
  id: string;
  name: string;
  price: number;
  departmentId: string;
  [key: string]: any; 
}

const useDefaultMedicalService = (departmentId: string | null) => {
  const [defaultService, setDefaultService] = useState<DefaultMedicalService | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefaultService = async () => {
    if (!departmentId) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/medical-services/default`,
        {
          params: { departmentId },
        }
      );
      setDefaultService(res.data.result);
    } catch (err: any) {
      console.error("Lỗi khi lấy dịch vụ mặc định:", err);
      setError("Không thể tải dịch vụ mặc định.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultService();
  }, [departmentId]);

  return {
    defaultService,
    loading,
    error,
    refetch: fetchDefaultService,
  };
};

export default useDefaultMedicalService;
