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
    } catch (error) {
      console.error("Failed to fetch patient detail:", error);
      toast.error("Không thể lấy thông tin chi tiết bệnh nhân.");
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
