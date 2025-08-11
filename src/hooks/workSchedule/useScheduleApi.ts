import { getErrorMessage } from "../../components/utils/getErrorMessage";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export interface UpdateSchedulePayload {
  idsToDelete: string[];
  newSchedules: {
    shiftId: string;
    shiftDate: string;
    note?: string;
    status: string;
  }[];
}

export const useScheduleApi = () => {
  const updateSchedule = async (
    staffId: string,
    payload: UpdateSchedulePayload
  ) => {
    try {
      await axiosInstance.put(
        `/work-schedules/bulk-update/${staffId}`,
        payload
      );
      toast.success("Cập nhật lịch làm việc thành công");
    } catch (error: any) {
      console.error("Error updating schedule", error);
      toast.error(getErrorMessage(error, "Lỗi khi cập nhật lịch làm việc"));
      throw error;
    }
  };

  const deleteSchedule = async (staffId: string, id: string) => {
    try {
      const payload: UpdateSchedulePayload = {
        idsToDelete: [id],
        newSchedules: [],
      };
      await axiosInstance.put(
        `/work-schedules/bulk-update/${staffId}`,
        payload
      );
      toast.success("Xoá lịch làm việc thành công");
    } catch (error: any) {
      console.error("Error deleting schedule", error);
      toast.error(getErrorMessage(error, "Lỗi khi xoá lịch làm việc"));
      throw error;
    }
  };

  return {
    updateSchedule,
    deleteSchedule,
  };
};
