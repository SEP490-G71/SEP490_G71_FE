import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { StaffFeedbackItem } from "../../../types/Admin/Feedback/StaffFeedback";

const useStaffFeedbackByStaff = () => {
  const [feedbacks, setFeedbacks] = useState<StaffFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByStaffId = async (staffId: string): Promise<StaffFeedbackItem[]> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/staff-feedbacks/by-staff/${staffId}`);
      const list = (res.data?.result ?? res.data ?? []) as StaffFeedbackItem[];
      setFeedbacks(list);
      return list;
    } catch (err) {
      console.error("Failed to fetch staff feedbacks:", err);
      const msg = "Không thể tải phản hồi của nhân viên";
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

  return { feedbacks, loading, error, fetchByStaffId, reset, removeLocal };
};

export default useStaffFeedbackByStaff;