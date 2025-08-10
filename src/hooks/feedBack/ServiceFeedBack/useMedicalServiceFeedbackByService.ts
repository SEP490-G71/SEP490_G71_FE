import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";

export interface MedicalServiceFeedback {
  id: string;
  serviceId: string;
  serviceName: string;
  comment: string;
  rating: number;
  createdAt: string;
  patientId?: string;
  medicalRecordId?: string;
}

const useMedicalServiceFeedbackByService = () => {
  const [feedbacks, setFeedbacks] = useState<MedicalServiceFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByServiceId = async (
    serviceId: string
  ): Promise<MedicalServiceFeedback[]> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get(
        `/medical-service-feedbacks/by-medical-service/${serviceId}`
      );
      const list = (res?.data?.result ?? res?.data ?? []) as MedicalServiceFeedback[];
      setFeedbacks(list);
      return list;
    } catch (err) {
      console.error("Failed to fetch medical service feedbacks:", err);
      const msg = "Không thể tải phản hồi của dịch vụ y tế";
      setError(msg);
      toast.error(msg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const removeLocal = (id: string) => {
    setFeedbacks((prev) => prev.filter((x) => x.id !== id));
  };

  const reset = () => {
    setFeedbacks([]);
    setError(null);
  };

  return { feedbacks, loading, error, fetchByServiceId, reset, removeLocal };
};

export default useMedicalServiceFeedbackByService;
