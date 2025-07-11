import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { WorkSchedule } from "../../types/Admin/WorkSchedule/WorkSchedule";
import { toast } from "react-toastify";

export const useWorkSchedule = () => {
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchWorkSchedules = async (
    page: number = 0,
    size: number = 10,
    shift?: string
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/work-schedule", {
        params: { page, size, shift },
      });
      setWorkSchedules(res.data.result.content);
      setTotalItems(res.data.result.totalElements);
    } catch (error) {
      console.error("Failed to fetch work schedules:", error);
      toast.error("Lỗi tải dữ liệu lịch làm việc");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkScheduleDetailByStaffId = async (staffId: string) => {
    try {
      const res = await axiosInstance.get(`/work-schedule/staff/${staffId}`);
      const result = res.data.result;
      return Array.isArray(result) ? result : [];
    } catch (err) {
      console.error("Failed to fetch external schedule:", err);
      toast.error("Không thể lấy chi tiết lịch làm việc nhân viên (external)");
      return [];
    }
  };

  const deleteWorkScheduleDetailById = async (id: string) => {
    try {
      await axiosInstance.delete(`/medical-diagnosis/work-schedule/${id}`);
      toast.success("Xoá ca làm việc thành công");
    } catch (error) {
      console.error("Failed to delete work schedule detail", error);
      toast.error("Xoá ca làm việc thất bại");
    }
  };

  const updateWorkScheduleDetailById = async (
    id: string,
    data: {
      shiftDate: string;
      shift: string;
      status: string;
      note?: string;
    }
  ) => {
    try {
      await axiosInstance.put(`/work-schedule/update-detail/${id}`, data);
      toast.success("Cập nhật ca làm việc thành công");
    } catch (error) {
      console.error("Failed to update work schedule detail", error);
      toast.error("Cập nhật ca làm việc thất bại");
    }
  };

  const createWorkSchedule = async (data: {
    staffId: string;
    shift: string;
    daysOfWeek: string[];
    startDate: string;
    endDate: string;
    note?: string;
  }) => {
    try {
      await axiosInstance.post("/work-schedule", data);
      toast.success("Tạo lịch làm việc thành công");
    } catch (error) {
      console.error("Failed to create work schedule", error);
      toast.error("Tạo lịch làm việc thất bại");
    }
  };

  const updateWorkSchedule = async (data: {
    staffId: string;
    shift: string;
    daysOfWeek: string[];
    startDate: string;
    endDate: string;
    note?: string;
  }) => {
    try {
      await axiosInstance.put("/work-schedule", data);
      toast.success("Cập nhật lịch làm việc thành công");
    } catch (error) {
      console.error("Failed to update work schedule", error);
      toast.error("Cập nhật lịch làm việc thất bại");
    }
  };

  const deleteWorkScheduleByStaff = async (staffId: string) => {
    try {
      await axiosInstance.delete(`/work-schedule/by-staff/${staffId}`);
      toast.success("Xoá lịch làm việc thành công");
    } catch (error) {
      console.error("Failed to delete work schedule", error);
      toast.error("Xoá lịch làm việc thất bại");
    }
  };

  return {
    workSchedules,
    loading,
    totalItems,
    fetchWorkSchedules,
    fetchWorkScheduleDetailByStaffId,
    deleteWorkScheduleDetailById,
    updateWorkScheduleDetailById,
    createWorkSchedule,
    updateWorkSchedule,
    deleteWorkScheduleByStaff,
  };
};
