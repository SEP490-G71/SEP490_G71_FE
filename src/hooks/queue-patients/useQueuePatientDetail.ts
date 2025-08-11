import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { QueuePatient } from "../../types/Queue-patient/QueuePatient";

const useQueuePatientDetail = (id: string | null) => {
  const [patientDetail, setPatientDetail] = useState<QueuePatient | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQueuePatientDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/queue-patients/detail/${id}`);
      setPatientDetail(res.data.result);
    } catch (error: any) {
      console.error(" Failed to fetch patient detail:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (Array.isArray(error?.response?.data?.errors) &&
          error?.response?.data?.errors[0]) ||
        error?.message ||
        "Không thể lấy thông tin chi tiết bệnh nhân.";

      toast.error(` ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueuePatientDetail();
  }, [id]);

  return {
    patientDetail,
    loading,
    refetch: fetchQueuePatientDetail,
  };
};

export default useQueuePatientDetail;
