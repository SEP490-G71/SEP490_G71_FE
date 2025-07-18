import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { QueuePatientsResponse } from "../../types/Admin/UserViewMedicalExamination/UserViewMedicalExamination";

const useUserViewMedicalExamination = () => {
  const [queuePatients, setQueuePatients] = useState<QueuePatientsResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchQueuePatients = async () => {
    try {
      const res = await axiosInstance.get("/queue-patients");
      setQueuePatients(res.data.result);
    } catch (err) {
      console.error("Error fetching queue patients", err);
    } finally {
      setLoading(false);
    }
  };

  const pollUpdates = async () => {
    try {
      const res = await axiosInstance.get("/queue-patients/polling", {
        timeout: 30000,
      });
      if (res.data) setQueuePatients(res.data);
      pollUpdates(); // tiếp tục gọi lại
    } catch (err: any) {
      console.warn("Long-polling error:", err.message);
      setTimeout(pollUpdates, 3000); // thử lại sau 3s
    }
  };

  useEffect(() => {
    fetchQueuePatients();
    pollUpdates();
  }, []);

  return { queuePatients, loading };
};

export default useUserViewMedicalExamination;
