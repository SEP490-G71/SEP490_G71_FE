import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

const useDeleteMedicalServiceFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const deleteById = async (feedbackId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.delete(`/medical-service-feedbacks/${feedbackId}`);
      toast.success("Đã xoá phản hồi");
      return true;
    } catch (err) {
      console.error("Failed to delete medical service feedback:", err);
      const msg = "Xoá phản hồi thất bại";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteById, loading, error };
};

export default useDeleteMedicalServiceFeedback;
