import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

export interface CreateLeaveRequestByTimeDto {
  staffId: string;
  reason: string;
  fromDateTime: string; // ISO format
  toDateTime: string;   // ISO format
}

export const useCreateLeaveRequestByTime = () => {
  const [loading, setLoading] = useState(false);

  const createLeaveRequestByTime = async (
    dto: CreateLeaveRequestByTimeDto
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await axiosInstance.post(
        "/leave-requests/by-time",
        dto
      );
      toast.success("Tạo đơn nghỉ phép theo khoảng thời gian thành công");
      return true;
    } catch (err: any) {
      console.error("❌ Lỗi tạo đơn nghỉ phép theo thời gian:", err);
      toast.error(
        err?.response?.data?.message || "Tạo đơn nghỉ phép thất bại"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLeaveRequestByTime,
    loading,
  };
};
