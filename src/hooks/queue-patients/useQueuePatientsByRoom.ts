import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { QueuePatientsResponse } from "../../types/Admin/UserViewMedicalExamination/UserViewMedicalExamination";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

const useQueuePatientsByRoom = (roomId: string) => {
  const [queuePatients, setQueuePatients] = useState<QueuePatientsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Ngăn race when roomId đổi nhanh
  const versionRef = useRef(0);

  const fetchQueuePatients = useCallback(async () => {
    if (!roomId) return;
    const myVersion = ++versionRef.current;
    try {
      const res = await axiosInstance.get(`/queue-patients/by-room/${roomId}`);
      if (myVersion !== versionRef.current) return;
      setQueuePatients(res.data?.result ?? res.data ?? []);
    } catch (err: any) {
      if (myVersion !== versionRef.current) return;
      console.error("Error fetching queue patients by room", err);
      toast.error(getErrorMessage(err, "Lỗi khi tải danh sách bệnh nhân theo phòng"));
    } finally {
      if (myVersion === versionRef.current) setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    fetchQueuePatients();

    // Tạo interval refetch mỗi 2 giây
    const interval = setInterval(() => {
      fetchQueuePatients();
    }, 2000);

    return () => {
      versionRef.current++;
      clearInterval(interval);
    };
  }, [roomId, fetchQueuePatients]);

  return { queuePatients, loading, refetch: fetchQueuePatients };
};

export default useQueuePatientsByRoom;

