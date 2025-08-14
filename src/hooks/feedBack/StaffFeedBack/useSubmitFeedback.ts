import { useState, useCallback } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { SatisfactionLevel } from "../../../enums/FeedBack/SatisfactionLevel";
import { toast } from "react-toastify";

export interface SubmitFeedbackPayload {
  doctorId: string;
  patientId: string;
  medicalRecordId: string;
  satisfactionLevel: SatisfactionLevel; // string enum
  comment?: string;
}

export const useSubmitFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitFeedback = useCallback(async (payload: SubmitFeedbackPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axiosInstance.post(
        "/staff-feedbacks",
        {
          doctorId: payload.doctorId,
          patientId: payload.patientId,
          medicalRecordId: payload.medicalRecordId,
          satisfactionLevel: payload.satisfactionLevel, 
          comment: payload.comment ?? "",
        }
      );
      setSuccess(true);
       toast.success("Gửi góp ý  nhân viên thành công!");
      return res.data;
    } catch (err: any) {
     const msg = err?.response?.data?.message || err?.message || "Unknown error";
      setError(msg);
      toast.error(msg); 
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, success, submitFeedback };
};
