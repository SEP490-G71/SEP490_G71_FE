import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { SatisfactionLevel } from "../../../enums/FeedBack/SatisfactionLevel";

export interface MedicalServiceFeedbackByRecordItem {
  id: string;
  medicalServiceId: string;
  medicalServiceName: string;
  patientId: string;
  patientName: string;
  medicalRecordId: string;
  satisfactionLevel: SatisfactionLevel | string; 
  comment?: string;
  createdAt: string;
}

const useMedicalServiceFeedbackByRecord = () => {
  const [feedbacks, setFeedbacks] = useState<MedicalServiceFeedbackByRecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetchByRecordId = async (recordId: string): Promise<MedicalServiceFeedbackByRecordItem[]> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(
        `/medical-service-feedbacks/by-record/${recordId}`
      );
      const list = (res?.data?.result ?? res?.data ?? []) as MedicalServiceFeedbackByRecordItem[];
      setFeedbacks(list);
      return list;
    } catch (err) {
      console.error("Failed to fetch medical service feedbacks by record:", err);
      const msg = "Không thể tải phản hồi dịch vụ theo hồ sơ";
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

  return { feedbacks, loading, error, fetchByRecordId, removeLocal, reset };
};

export default useMedicalServiceFeedbackByRecord;
