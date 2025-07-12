import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { Shift } from "../../../enums/Admin/Shift";
import { LeaveRequestResponse } from "../../../types/Admin/Leave/LeaveRequestResponse";

export interface CreateLeaveRequestDto {
  staffId: string;
  reason: string;
  details: {
    date: string; 
    shift: Shift;
  }[];
}

export const useCreateLeaveRequest = () => {
  const [loading, setLoading] = useState(false);

  const createLeaveRequest = async (
    dto: CreateLeaveRequestDto
  ): Promise<LeaveRequestResponse | null> => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/leave-request", dto);
      toast.success("Tạo đơn nghỉ phép thành công");
      return res.data.result as LeaveRequestResponse;
    } catch (err: any) {
      console.error("❌ Lỗi tạo đơn nghỉ phép:", err);
      toast.error(err?.response?.data?.message || "Tạo đơn nghỉ phép thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createLeaveRequest, loading };
};
