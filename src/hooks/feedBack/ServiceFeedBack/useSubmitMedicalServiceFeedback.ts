import { useState, useCallback } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { SatisfactionLevel } from "../../../enums/FeedBack/SatisfactionLevel";

export interface SubmitMedicalServiceFeedbackPayload {
  medicalServiceId: string;    
  patientId: string;
  medicalRecordId: string;
  satisfactionLevel: keyof typeof SatisfactionLevel; 
  comment?: string;
}

export const useSubmitMedicalServiceFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitServiceFeedback = useCallback(
    async (payload: SubmitMedicalServiceFeedbackPayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const res = await axiosInstance.post(
          "/medical-service-feedbacks",
          {
            medicalServiceId: payload.medicalServiceId,
            patientId: payload.patientId,
            medicalRecordId: payload.medicalRecordId,
            satisfactionLevel: payload.satisfactionLevel, 
            comment: payload.comment || "",
          }
        );
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "Unknown error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, success, submitServiceFeedback };
};
