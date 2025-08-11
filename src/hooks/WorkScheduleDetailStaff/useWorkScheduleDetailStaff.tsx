import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { WorkScheduleDetail } from "../../types/Admin/WorkSchedule/WorkSchedule";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export const useWorkScheduleDetailStaff = () => {
  const [schedules, setSchedules] = useState<WorkScheduleDetail[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkScheduleDetail = async () => {
    setLoading(true);
    try {
      const resUser = await axiosInstance.get("/accounts/myInfo");
      const userId = resUser?.data?.result?.userId;

      if (!userId) {
        throw new Error("Không tìm thấy userId");
      }

      const resSchedule = await axiosInstance.get(
        `/work-schedules/staff/${userId}`
      );
      const result = resSchedule?.data?.result ?? [];
      setSchedules(result);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tải lịch làm việc"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkInWorkSchedule = async (workScheduleId: string) => {
    try {
      await axiosInstance.post(`/work-schedules/check-in/${workScheduleId}`);
      toast.success("Chấm công thành công");
      fetchWorkScheduleDetail(); // cập nhật lại danh sách ca
    } catch (error) {
      toast.error(getErrorMessage(error, "Chấm công thất bại"));
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkScheduleDetail();
  }, []);

  return {
    schedules,
    loading,
    refresh: fetchWorkScheduleDetail,
    checkInWorkSchedule,
  };
};
