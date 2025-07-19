import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalRecordDetail } from "../../types/MedicalRecord/MedicalRecordDetail";


const useMedicalRecordDetail = () => {
  const [recordDetail, setRecordDetail] = useState<MedicalRecordDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMedicalRecordDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/medical-records/${id}`);
      const result = response.data?.result;
      if (result) {
        setRecordDetail(result);
      } else {
        setRecordDetail(null);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết hồ sơ bệnh án:", err);
      setRecordDetail(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    recordDetail,
    loading,
    fetchMedicalRecordDetail,
  };
};

export default useMedicalRecordDetail;
