import { useState, useCallback } from "react";
import axiosInstance from "../../../services/axiosInstance";

export interface MedicalServiceFeedbackUpdateBody {
  medicalServiceId: string;
  patientId: string;
  medicalRecordId: string;
   satisfactionLevel: string;
  comment?: string;
}

export const useUpdateMedicalServiceFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

   const updateMedicalServiceFeedback = useCallback(
    async (id: string, body: MedicalServiceFeedbackUpdateBody) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const res = await axiosInstance.put(`/medical-service-feedbacks/${id}`, {
          medicalServiceId: body.medicalServiceId,
          patientId: body.patientId,
          medicalRecordId: body.medicalRecordId,
          satisfactionLevel: body.satisfactionLevel, 
          comment: body.comment ?? "",
        });
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Unknown error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { updateMedicalServiceFeedback, loading, error, success };
};
