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
      setQueuePatients(res.data.result ?? []);
    } catch (err: any) {
      console.error("Error fetching queue patients", err);
      toast.error(
        getErrorMessage(err, "Lỗi khi tải danh sách bệnh nhân chờ khám")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch lần đầu
    fetchQueuePatients();

    // set interval 5s refetch
    const interval = setInterval(() => {
      fetchQueuePatients();
    }, 5000);

    return () => clearInterval(interval); // cleanup khi unmount
  }, []);

  return { queuePatients, loading, refetch: fetchQueuePatients };
};

export default useUserViewMedicalExamination;
