import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { QueuePatientsResponse } from "../../types/Admin/UserViewMedicalExamination/UserViewMedicalExamination";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

const useQueuePatientsByRoom = (roomId: string) => {
  const [queuePatients, setQueuePatients] = useState<QueuePatientsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueuePatients = async () => {
    try {
      const res = await axiosInstance.get(`/queue-patients/by-room/${roomId}`);
      setQueuePatients(res.data?.result ?? res.data ?? []);
    } catch (err: any) {
      console.error("Error fetching queue patients by room", err);
      toast.error(getErrorMessage(err, "Lỗi khi tải danh sách bệnh nhân theo phòng"));
    } finally {
      setLoading(false);
    }
  };

//   const pollUpdates = async () => {
//     try {
//       const res = await axiosInstance.get(`/queue-patients/by-room/${roomId}`, {
//         timeout: 15000,
//       });
//       if (res.data) setQueuePatients(res.data?.result ?? res.data ?? []);
//       pollUpdates(); 
//     } catch (err: any) {
//       console.warn("Polling (by-room) error:", err?.message || err);
//       setTimeout(pollUpdates, 3000); 
//     }
//   };

  useEffect(() => {
    if (!roomId) return; 
    fetchQueuePatients();
    // pollUpdates();
  }, [roomId]);

  return { queuePatients, loading };
};

export default useQueuePatientsByRoom;
