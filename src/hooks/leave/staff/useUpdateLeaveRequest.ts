import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { Shift } from "../../../enums/Admin/Shift";
import { LeaveRequestResponse } from "../../../types/Admin/Leave/LeaveRequestResponse";

export interface UpdateLeaveRequestDto {
  reason: string;
  details: {
    date: string; 
    shift: Shift;
  }[];
}

export const useUpdateLeaveRequest = () => {
  const [loading, setLoading] = useState(false);

  const updateLeaveRequest = async (
    leaveRequestId: string,
    dto: UpdateLeaveRequestDto
  ): Promise<LeaveRequestResponse | null> => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `/leave-requests/${leaveRequestId}`,
        dto
      );
      toast.success("Cập nhật đơn nghỉ thành công");
      return res.data.result as LeaveRequestResponse;
    } catch (err: any) {
      console.error("❌ Lỗi cập nhật đơn nghỉ:", err);
      toast.error(
        err?.response?.data?.message || "Cập nhật đơn nghỉ thất bại"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateLeaveRequest, loading };
};
