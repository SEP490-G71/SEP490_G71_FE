import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { QueuePatientsResponse } from "../../types/Admin/UserViewMedicalExamination/UserViewMedicalExamination";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

const useUserViewMedicalExamination = () => {
  const [queuePatients, setQueuePatients] = useState<QueuePatientsResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchQueuePatients = async () => {
    try {
      const res = await axiosInstance.get("/queue-patients");
      setQueuePatients(res.data.result);
    } catch (err: any) {
      console.error("Error fetching queue patients", err);
      toast.error(
        getErrorMessage(err, "Lỗi khi tải danh sách bệnh nhân chờ khám")
      );
    } finally {
      setLoading(false);
    }
  };

  const pollUpdates = async () => {
    try {
      const res = await axiosInstance.get("/queue-patients/polling", {});
      if (res.data) setQueuePatients(res.data);
      pollUpdates(); // tiếp tục gọi lại
    } catch (err: any) {
      console.warn("Long-polling error:", err.message);
    }
  };

  useEffect(() => {
    fetchQueuePatients();
    pollUpdates();
  }, []);

  return { queuePatients, loading };
};

export default useUserViewMedicalExamination;
