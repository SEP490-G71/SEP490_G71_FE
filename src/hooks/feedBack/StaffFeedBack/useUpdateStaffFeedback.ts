import { useState, useCallback } from "react";
import axiosInstance from "../../../services/axiosInstance";


export interface StaffFeedbackUpdateBody {
  doctorId: string;
  patientId: string;
  medicalRecordId: string;
  satisfactionLevel: string; 
  comment?: string;
}

export const useUpdateStaffFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateStaffFeedback = useCallback(async (id: string, body: StaffFeedbackUpdateBody) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      
      const res = await axiosInstance.put(`/staff-feedbacks/${id}`, {
        doctorId: body.doctorId,
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
  }, []);

  return { updateStaffFeedback, loading, error, success };
};