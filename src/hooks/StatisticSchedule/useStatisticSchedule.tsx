import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { ScheduleStatisticItem } from "../../types/Admin/StatisticSchedule/StatisticSchedule";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export const useStatisticSchedule = () => {
  const [statistics, setStatistics] = useState<ScheduleStatisticItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalShifts: 0,
    attendedShifts: 0,
    leaveShifts: 0,
    totalStaffs: 0,
    attendanceRate: 0,
  });

  const fetchScheduleStatistics = async (
    page: number = 0,
    size: number = 10,
    filters?: {
      fromDate?: string;
      toDate?: string;
      staffId?: string;
    }
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/work-schedules/statistics", {
        params: {
          page,
          size,
          fromDate: filters?.fromDate,
          toDate: filters?.toDate,
          staffId: filters?.staffId,
        },
      });

      const result = res.data.result;
      const details = result.details;

      setStatistics(details.content);
      setTotalItems(details.totalElements);

      setSummary({
        totalShifts: result.totalShifts,
        attendedShifts: result.attendedShifts,
        leaveShifts: result.leaveShifts,
        totalStaffs: result.totalStaffs,
        attendanceRate: result.attendanceRate,
      });
    } catch (error: any) {
      toast.error(
        getErrorMessage(error, "Không thể tải dữ liệu thống kê lịch làm việc")
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportScheduleStatistics = async (filters?: {
    fromDate?: string;
    toDate?: string;
    staffId?: string;
  }) => {
    try {
      const res = await axiosInstance.get("/work-schedules/statistics/export", {
        params: {
          fromDate: filters?.fromDate,
          toDate: filters?.toDate,
          staffId: filters?.staffId,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "work_schedule_statistics.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Export Excel thất bại"));
      console.error("Export error", error);
    }
  };

  return {
    statistics,
    totalItems,
    loading,
    fetchScheduleStatistics,
    exportScheduleStatistics,
    summary,
  };
};

export default useStatisticSchedule;
