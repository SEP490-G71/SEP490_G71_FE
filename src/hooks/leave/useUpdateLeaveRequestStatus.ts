import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { LeaveRequestStatus } from "../../enums/Admin/LeaveRequestStatus";
import { toast } from "react-toastify";

interface UpdateLeaveStatusPayload {
  leaveRequestId: string;
  status: LeaveRequestStatus;
  note?: string;
}

export const useUpdateLeaveRequestStatus = () => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (payload: UpdateLeaveStatusPayload) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put("/leave-requests/status", payload);

      toast.success(res.data?.message || "Cập nhật trạng thái thành công");
      return res.data?.result;
    } catch (err: any) {
      console.error("❌ Lỗi khi cập nhật trạng thái nghỉ phép:", err);
      toast.error(
        err.response?.data?.message || "Cập nhật trạng thái thất bại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading };
};
