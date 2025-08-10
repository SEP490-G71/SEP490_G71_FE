import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

const useDeleteStaffFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteById = async (feedbackId: string) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.delete(`/staff-feedbacks/${feedbackId}`);
      toast.success("Đã xoá phản hồi");
      return true;
    } catch (err) {
      console.error("Failed to delete staff feedback:", err);
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

export default useDeleteStaffFeedback;