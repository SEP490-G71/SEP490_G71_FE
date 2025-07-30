import { useState } from "react";

import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";

export const useDeleteLeaveRequest = () => {
  const [loading, setLoading] = useState(false);

  const deleteLeaveRequest = async (leaveRequestId: string): Promise<boolean> => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/leave-requests/${leaveRequestId}`);
      toast.success("Xoá đơn nghỉ phép thành công");
      return true;
    } catch (err: any) {
      console.error("❌ Lỗi xoá đơn nghỉ phép:", err);
      toast.error(err?.response?.data?.message || "Xoá đơn nghỉ phép thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteLeaveRequest,
    loading,
  };
};
